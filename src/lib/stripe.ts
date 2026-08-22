import Stripe from 'stripe';

const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_for_mock_mode';

export const stripe = new Stripe(apiKey, {
  appInfo: {
    name: 'Al-Huda Quran Academy Platform',
    version: '1.0.0',
  },
});
