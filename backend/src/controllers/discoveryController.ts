import { Request, Response } from 'express';
import User from '../models/User';
import Swipe from '../models/Swipe';
import Match from '../models/Match';
import { generateRecommendations } from '../services/recommendationService';

// @desc    Get discovery stack
// @route   GET /api/discovery/stack
// @access  Private
export const getStack = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    const limit = parseInt(req.query.limit as string) || 50;

    const recommendations = await generateRecommendations(userId, limit);
    res.json(recommendations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Swipe on user
// @route   POST /api/discovery/swipe
// @access  Private
export const swipe = async (req: Request, res: Response) => {
  try {
    const { swipedId, action, compatibilityScore } = req.body;
    const swiperId = req.user!._id;

    // Create swipe record
    await Swipe.create({
      swiperId,
      swipedId,
      action,
      compatibilityScore,
    });

    // Check for mutual like (match)
    if (action === 'like') {
      const mutualLike = await Swipe.findOne({
        swiperId: swipedId,
        swipedId: swiperId,
        action: 'like',
      });

      if (mutualLike) {
        // Create match
        const match = await Match.create({
          users: [swiperId, swipedId],
          soulDensityScore: compatibilityScore,
          scoreBreakdown: {
            personality: compatibilityScore * 0.3,
            communication: compatibilityScore * 0.25,
            values: compatibilityScore * 0.2,
            interests: compatibilityScore * 0.15,
            lifestyle: compatibilityScore * 0.1,
          },
        });

        // Update user stats
        await User.updateMany(
          { _id: { $in: [swiperId, swipedId] } },
          { $inc: { 'stats.matches': 1 } }
        );

        return res.json({ matched: true, match });
      }
    }

    res.json({ matched: false });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get users who liked you
// @route   GET /api/discovery/likes
// @access  Private
export const getLikes = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    const likes = await Swipe.find({
      swipedId: userId,
      action: 'like',
    })
      .populate('swiperId', 'profile.firstName profile.photos profile.age')
      .sort({ timestamp: -1 });

    res.json(likes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get passed users
// @route   GET /api/discovery/passed
// @access  Private
export const getPassed = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    const passed = await Swipe.find({
      swiperId: userId,
      action: 'pass',
    })
      .populate('swipedId', 'profile.firstName profile.photos')
      .sort({ timestamp: -1 })
      .limit(100);

    res.json(passed);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

