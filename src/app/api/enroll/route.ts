import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import * as bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const enrollSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  ageGroup: z.enum(['5-12', '13-17', '18-24', '25+']),
  riwayahPreference: z.string().min(1),
  experience: z.string().optional(),
  audioUrl: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = enrollSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { fullName, email, password, ageGroup, riwayahPreference, experience, audioUrl } = parsed.data;

    // Generate a secure temporary password if none provided, else hash the provided password
    const passwordHash = password 
      ? await bcrypt.hash(password, 10)
      : await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);

    const application = await prisma.application.create({
      data: {
        user: {
          connectOrCreate: {
            where: { email },
            create: {
              email,
              passwordHash,
              name: fullName,
              type: 'STUDENT',
            }
          }
        },
        type: 'STUDENT',
        submittedData: JSON.stringify({
          ageGroup,
          riwayahPreference,
          experience,
          audioUrl,
        }),
        status: 'PENDING',
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Application received. Please proceed to payment.',
      applicationId: application.id
    });

  } catch (error: unknown) {
    console.error('Enrollment Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      message: 'Failed to submit application.',
      error: message
    }, { status: 500 });
  }
}
