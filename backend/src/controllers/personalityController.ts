import { Request, Response } from 'express';
import User from '../models/User';

export const submitQuiz = async (req: Request, res: Response) => {
  try {
    const { personalityProfile } = req.body;
    const user = await User.findById(req.user!._id);

    if (user) {
      user.profile.personalityProfile = {
        ...user.profile.personalityProfile,
        ...personalityProfile,
      };
      await user.save();
    }

    res.json({ message: 'Personality profile updated' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!._id);
    res.json(user?.profile.personalityProfile);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getInsights = async (req: Request, res: Response) => {
  try {
    // Placeholder - would use AI to generate insights
    const insights = [
      {
        date: new Date(),
        insight: 'You value deep conversations and emotional connection',
        scoreChange: 5,
      },
    ];

    res.json(insights);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

