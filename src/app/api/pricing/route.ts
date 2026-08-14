import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const plans = await prisma.pricingPlan.findMany({
      orderBy: { price: 'asc' }
    });
    return NextResponse.json(plans);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
