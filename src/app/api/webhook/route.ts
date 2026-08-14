import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  const session = event.data.object as any;

  if (event.type === 'checkout.session.completed') {
    const userId = session.metadata?.userId;

    if (!userId) {
      console.error('Webhook missing userId in metadata');
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Verify user exists before updating
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.error('Webhook: user not found:', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create Payment record with properly serialized gateway response
    await prisma.payment.create({
      data: {
        userId,
        amount: (session.amount_total || 0) / 100,
        status: 'COMPLETED',
        gatewayResponse: JSON.stringify(session),
      },
    });

    // Update pending applications for this user to reflect feePaid = true
    await prisma.application.updateMany({
      where: {
        userId,
        status: 'PENDING',
      },
      data: {
        feePaid: true,
      },
    });
  }

  return NextResponse.json({ received: true });
}
