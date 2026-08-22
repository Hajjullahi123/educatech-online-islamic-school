import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const enrollStudentSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').default('student123'),
  currentLevel: z.string().default('Beginner'),
  targetRiwayah: z.string().default('Hafs'),
  learningGoals: z.string().optional().default('Quran recitation & Tajweed mastery'),
});

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Only School Admins can enroll students' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = enrollStudentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { fullName, email, password, currentLevel, targetRiwayah, learningGoals } = parsed.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'A student account with this email already exists' }, { status: 409 });
    }

    // Get admin user to link to their organization
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organizationId: true },
    });

    const passwordHash = await bcrypt.hash(password, 10);

    const newStudent = await prisma.user.create({
      data: {
        name: fullName,
        email,
        passwordHash,
        type: 'STUDENT',
        organizationId: adminUser?.organizationId || null,
        studentProfile: {
          create: {
            currentLevel,
            targetRiwayah,
            learningGoals,
            totalMinutes: 0,
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Student enrolled successfully',
      student: {
        id: newStudent.id,
        name: newStudent.name,
        email: newStudent.email,
        studentProfile: newStudent.studentProfile,
      },
    });
  } catch (error: any) {
    console.error('Admin Student Enrollment Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to enroll student' }, { status: 500 });
  }
}
