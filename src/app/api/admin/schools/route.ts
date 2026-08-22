import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createSchoolSchema = z.object({
  schoolName: z.string().min(2, 'School name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  adminName: z.string().min(2, 'Admin name must be at least 2 characters'),
  adminEmail: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  primaryColor: z.string().default('#064e3b'),
  secondaryColor: z.string().default('#d97706'),
});

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Only Super Admins can register new schools' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createSchoolSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { schoolName, slug, adminName, adminEmail, password, primaryColor, secondaryColor } = parsed.data;

    // Check if slug already exists
    const existingOrg = await prisma.organization.findUnique({ where: { slug } });
    if (existingOrg) {
      return NextResponse.json({ error: 'A school with this subdomain/slug already exists' }, { status: 409 });
    }

    // Check if admin email already exists
    const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existingUser) {
      return NextResponse.json({ error: 'A user with this admin email already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create organization and admin user in a transaction
    const [organization, adminUser] = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: schoolName,
          slug,
          primaryColor,
          secondaryColor,
        },
      });

      const user = await tx.user.create({
        data: {
          email: adminEmail,
          name: adminName,
          passwordHash,
          type: 'ADMIN',
          organizationId: org.id,
        },
      });

      return [org, user];
    });

    return NextResponse.json({
      success: true,
      message: 'School created successfully',
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
      },
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
      },
    });
  } catch (error: any) {
    console.error('Create School Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to register school' }, { status: 500 });
  }
}
