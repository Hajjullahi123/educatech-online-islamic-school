import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, action } = await req.json(); // action is 'APPROVE' or 'REJECT'

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 444 });
    }

    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    // Update application status
    const updatedApp = await prisma.application.update({
      where: { id },
      data: { status: newStatus }
    });

    // If approved and is a TEACHER type, update their user role to TEACHER
    if (action === 'APPROVE' && application.type === 'TEACHER') {
      await prisma.user.update({
        where: { id: application.userId },
        data: { type: 'TEACHER' }
      });

      // Also ensure teacher profile is initialized
      const existingProfile = await prisma.teacherProfile.findUnique({
        where: { userId: application.userId }
      });

      if (!existingProfile) {
        let riwayatList = '[]';
        let hourlyRate = 25.0;
        try {
          const submitted = JSON.parse(application.submittedData);
          if (submitted.riwayatMastery) {
            riwayatList = JSON.stringify(submitted.riwayatMastery);
          }
          if (submitted.hourlyRate) {
            hourlyRate = parseFloat(submitted.hourlyRate);
          }
        } catch (e) {}

        await prisma.teacherProfile.create({
          data: {
            userId: application.userId,
            riwayatMastery: riwayatList,
            hourlyRate,
            availabilitySchedule: '{}',
            languages: 'English'
          }
        });
      }
    }

    // If approved and is a STUDENT type, update user role to STUDENT
    if (action === 'APPROVE' && application.type === 'STUDENT') {
      await prisma.user.update({
        where: { id: application.userId },
        data: { type: 'STUDENT' }
      });
    }

    return NextResponse.json({ success: true, application: updatedApp });
  } catch (error: any) {
    console.error('Admin Application Action Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
