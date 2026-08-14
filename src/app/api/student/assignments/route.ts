import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { assignmentId, audioUrl } = await req.json();

    if (!assignmentId || !audioUrl) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        status: 'SUBMITTED',
        audioUrl
      }
    });

    return NextResponse.json({ success: true, assignment: updatedAssignment });
  } catch (error: any) {
    console.error('Homework Submit Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit assignment' }, { status: 500 });
  }
}
