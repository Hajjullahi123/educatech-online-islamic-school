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
    const { assignmentId, grade, feedback } = await req.json();

    if (!assignmentId || !grade || !feedback) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        status: 'GRADED',
        grade,
        feedback
      }
    });

    return NextResponse.json({ success: true, assignment: updatedAssignment });
  } catch (error: any) {
    console.error('Teacher Grade Homework Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to grade assignment' }, { status: 500 });
  }
}
