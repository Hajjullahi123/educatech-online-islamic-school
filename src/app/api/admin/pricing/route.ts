import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const plans = await prisma.pricingPlan.findMany({
    orderBy: { price: 'asc' }
  });

  return NextResponse.json(plans);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, price, description, isPopular } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  const updatedPlan = await prisma.pricingPlan.update({
    where: { id },
    data: {
      price: parseFloat(price),
      description,
      isPopular: !!isPopular
    }
  });

  return NextResponse.json(updatedPlan);
}
