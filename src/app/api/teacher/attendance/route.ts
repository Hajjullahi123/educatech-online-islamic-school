import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user || (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { classId, attendanceList } = await req.json(); // attendanceList: [{ studentId, status: 'PRESENT' | 'LATE' | 'EXCUSED' | 'ABSENT' }]

    if (!classId || !attendanceList || !Array.isArray(attendanceList)) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const savedLogs = await Promise.all(
      attendanceList.map(async (item: { studentId: string; status: string }) => {
        // Upsert logs for the day (e.g. check if already took attendance today)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const existing = await prisma.attendance.findFirst({
          where: {
            classId,
            studentId: item.studentId,
            date: {
              gte: todayStart
            }
          }
        });

        if (existing) {
          return prisma.attendance.update({
            where: { id: existing.id },
            data: { status: item.status }
          });
        } else {
          return prisma.attendance.create({
            data: {
              classId,
              studentId: item.studentId,
              status: item.status,
              date: new Date()
            }
          });
        }
      })
    );

    return NextResponse.json({ success: true, count: savedLogs.length });
  } catch (error: any) {
    console.error('Attendance Save Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save attendance' }, { status: 500 });
  }
}
