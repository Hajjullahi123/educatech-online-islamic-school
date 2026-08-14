import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import * as bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const teacherApplySchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  riwayatMastery: z.array(z.string()).min(1, 'Select at least one Riwayah'),
  ijazahUrls: z.array(z.string().url()).optional().default([]),
  hourlyRate: z.number().min(5, 'Minimum hourly rate is $5').max(500, 'Maximum hourly rate exceeded'),
  availability: z.record(z.array(z.string())).optional().default({}),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = teacherApplySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      fullName,
      email,
      riwayatMastery,
      ijazahUrls,
      hourlyRate,
      availability,
      languages
    } = parsed.data;

    // Generate a secure random temporary password (will be reset via email verification link)
    const tempPassword = crypto.randomBytes(32).toString('hex');
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    // Create Teacher Application
    const application = await prisma.application.create({
      data: {
        user: {
          connectOrCreate: {
            where: { email },
            create: {
              email,
              passwordHash,
              name: fullName,
              type: 'TEACHER',
            }
          }
        },
        type: 'TEACHER',
        status: 'PENDING',
        submittedData: JSON.stringify({
          riwayatMastery,
          ijazahUrls,
          hourlyRate,
          availability,
          languages,
        })
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Teacher application submitted for verification.',
      applicationId: application.id
    });

  } catch (error: unknown) {
    console.error('Teacher Apply Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      message: 'Failed to submit application.',
      error: message
    }, { status: 500 });
  }
}
