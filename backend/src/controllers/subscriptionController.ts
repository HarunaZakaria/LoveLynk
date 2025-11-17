import { Request, Response } from 'express';
import User from '../models/User';

export const getPlans = async (req: Request, res: Response) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        features: ['50 swipes/day', 'Basic matching', 'Standard filters'],
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 19.99,
        features: [
          'Unlimited swipes',
          'See who liked you',
          '3 undos/day',
          'Advanced filters',
          'Read receipts',
        ],
      },
      {
        id: 'elite',
        name: 'Elite',
        price: 34.99,
        features: [
          'Everything in Premium',
          'Unlimited undos',
          'Message before matching',
          'Profile boost',
          'Background checks',
        ],
      },
    ];

    res.json(plans);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createCheckout = async (req: Request, res: Response) => {
  try {
    // Placeholder - would integrate with Stripe
    res.json({ sessionId: 'stripe_session_id' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    // Placeholder - would handle Stripe webhook
    res.json({ received: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStatus = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!._id);
    res.json({
      tier: user?.subscription.tier || 'free',
      expiresAt: user?.subscription.expiresAt,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!._id);
    if (user) {
      user.subscription.tier = 'free';
      user.subscription.expiresAt = undefined;
      await user.save();
    }
    res.json({ message: 'Subscription cancelled' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

