import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user || (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { studentId, subject, tajweedScore, hifzScore, fluencyScore, feedback } = await req.json();

    if (!studentId || !subject || tajweedScore === undefined || hifzScore === undefined || fluencyScore === undefined || !feedback) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const assessment = await prisma.assessment.create({
      data: {
        studentId,
        teacherName: session.user.name || 'Instructor',
        subject,
        tajweedScore: parseInt(tajweedScore),
        hifzScore: parseInt(hifzScore),
        fluencyScore: parseInt(fluencyScore),
        feedback
      }
    });

    return NextResponse.json({ success: true, assessment });
  } catch (error: any) {
    console.error('Gradebook Save Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save gradebook entry' }, { status: 500 });
  }
}
