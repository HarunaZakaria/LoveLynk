import { Request, Response } from 'express';
import Match from '../models/Match';

export const getMatches = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    const matches = await Match.find({
      users: userId,
      status: { $ne: 'unmatched' },
    })
      .populate('users', 'profile.firstName profile.photos profile.age')
      .sort({ matchedAt: -1 });

    res.json(matches);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMatch = async (req: Request, res: Response) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('users', 'profile')
      .populate('questsCompleted');

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json(match);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompatibility = async (req: Request, res: Response) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json({
      soulDensityScore: match.soulDensityScore,
      scoreBreakdown: match.scoreBreakdown,
      insights: match.compatibilityInsights,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const unmatch = async (req: Request, res: Response) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    match.status = 'unmatched';
    await match.save();

    res.json({ message: 'Unmatched successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

