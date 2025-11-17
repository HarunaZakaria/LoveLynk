import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ConnectionQuest from '../models/ConnectionQuest';
import Match from '../models/Match';

export const getAvailableQuests = async (req: Request, res: Response) => {
  try {
    const questTypes = [
      {
        type: 'conversation',
        title: 'Share a Memory',
        description: 'Exchange your favorite childhood memories',
      },
      {
        type: 'creative',
        title: 'Create Together',
        description: 'Build something together',
      },
      {
        type: 'discovery',
        title: 'Find Common Ground',
        description: 'Discover what you both love',
      },
      {
        type: 'future',
        title: 'Plan Your Date',
        description: 'Design your ideal first date together',
      },
    ];

    res.json(questTypes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createQuest = async (req: Request, res: Response) => {
  try {
    const { matchId, questType, title, description, prompt } = req.body;

    const quest = await ConnectionQuest.create({
      matchId,
      questType,
      title,
      description,
      prompt,
      status: 'pending',
    });

    res.status(201).json(quest);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuest = async (req: Request, res: Response) => {
  try {
    const quest = await ConnectionQuest.findById(req.params.id)
      .populate('matchId');

    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }

    res.json(quest);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const submitQuestResponse = async (req: Request, res: Response) => {
  try {
    const { response } = req.body;
    const quest = await ConnectionQuest.findById(req.params.id);

    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }

    quest.responses.push({
      userId: new mongoose.Types.ObjectId(req.user!._id),
      response,
      submittedAt: new Date(),
    });

    if (quest.responses.length === 2) {
      quest.status = 'completed';
      quest.completedAt = new Date();
      quest.soulPointsEarned = 10;
    } else {
      quest.status = 'in_progress';
    }

    await quest.save();

    res.json(quest);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const completeQuest = async (req: Request, res: Response) => {
  try {
    const quest = await ConnectionQuest.findById(req.params.id);
    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }

    quest.status = 'completed';
    quest.completedAt = new Date();
    await quest.save();

    res.json(quest);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuestHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    const matches = await Match.find({ users: userId }).distinct('_id');

    const quests = await ConnectionQuest.find({
      matchId: { $in: matches },
      status: 'completed',
    })
      .populate('matchId')
      .sort({ completedAt: -1 });

    res.json(quests);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

