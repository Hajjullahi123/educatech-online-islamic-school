import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import * as bcrypt from 'bcryptjs';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  type: z.enum(['STUDENT', 'TEACHER']).default('STUDENT'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password, type } = parsed.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user and profile
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        type,
        ...(type === 'STUDENT'
          ? {
              studentProfile: {
                create: {
                  currentLevel: 'Beginner',
                },
              },
            }
          : {
              teacherProfile: {
                create: {
                  hourlyRate: 25.0,
                  riwayatMastery: '[]',
                },
              },
            }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
      },
    });
  } catch (error: unknown) {
    console.error('Registration Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      message: 'Failed to register account',
      error: message,
    }, { status: 500 });
  }
}
