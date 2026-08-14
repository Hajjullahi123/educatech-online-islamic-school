import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const checkoutSchema = z.object({
  planId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const { planId } = parsed.data;

    // Fetch pricing plan details from database
    const plan = await prisma.pricingPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Pricing plan not found' }, { status: 404 });
    }

    // Convert database price (NGN) to USD using the exchange rate (0.00071)
    const convertedPrice = plan.price * 0.00071;
    const unitAmount = Math.round(convertedPrice * 100); // in cents

    // Use fixed, safe redirect paths to prevent open redirect attacks
    const successPath = '/dashboard?payment=success';
    const cancelPath = '/pricing';

    const stripeKey = process.env.STRIPE_SECRET_KEY || '';
    const isMock = !stripeKey || stripeKey === 'sk_test_...' || stripeKey.includes('...');

    if (isMock) {
      // 1. Update applications
      await prisma.application.updateMany({
        where: { userId: session.user.id, status: 'PENDING' },
        data: { feePaid: true },
      });

      // 2. Create Payment record
      await prisma.payment.create({
        data: {
          userId: session.user.id!,
          amount: unitAmount / 100,
          status: 'COMPLETED',
          gatewayResponse: JSON.stringify({ mock: true, planId: plan.id }),
        },
      });

      // 3. Ensure StudentProfile exists
      const existingProfile = await prisma.studentProfile.findUnique({
        where: { userId: session.user.id },
      });
      if (!existingProfile) {
        const app = await prisma.application.findFirst({
          where: { userId: session.user.id, type: 'STUDENT' },
          orderBy: { createdAt: 'desc' },
        });
        let targetRiwayah = 'Hafs';
        let learningGoals = '';
        if (app) {
          try {
            const data = JSON.parse(app.submittedData);
            targetRiwayah = data.riwayahPreference || 'Hafs';
            learningGoals = data.experience || '';
          } catch (e) {}
        }
        await prisma.studentProfile.create({
          data: {
            userId: session.user.id!,
            currentLevel: 'Beginner',
            targetRiwayah,
            learningGoals,
            totalMinutes: 0,
          },
        });
      }

      const redirectUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${successPath}&session_id=mock_${crypto.randomUUID()}`;
      return NextResponse.json({ sessionId: `mock_${crypto.randomUUID()}`, url: redirectUrl });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plan.name} Plan`,
              description: plan.description,
            },
            unit_amount: unitAmount,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      customer_email: session.user.email!,
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${successPath}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${cancelPath}`,
      metadata: {
        userId: session.user.id!,
        planId: plan.id,
      },
    });

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url });
  } catch (error: unknown) {
    console.error('Stripe Checkout Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
