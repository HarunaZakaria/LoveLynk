import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Chat, { IMessage } from '../models/Chat';
import Match from '../models/Match';

export const getChats = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'profile.firstName profile.photos')
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getChat = async (req: Request, res: Response) => {
  try {
    const chat = await Chat.findOne({ matchId: req.params.matchId })
      .populate('participants', 'profile');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(chat);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { content, type, audioUrl } = req.body;
    const matchId = req.params.matchId;
    const senderId = req.user!._id;

    let chat = await Chat.findOne({ matchId });

    if (!chat) {
      // Create chat if it doesn't exist
      const match = await Match.findById(matchId);
      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      }

      chat = await Chat.create({
        matchId,
        participants: match.users,
        messages: [],
        conversationStarters: [],
      });
    }

    const message: IMessage = {
      _id: new mongoose.Types.ObjectId(),
      senderId: new mongoose.Types.ObjectId(senderId),
      content,
      type: type || 'text',
      audioUrl,
      readBy: [],
      reactions: [],
      createdAt: new Date(),
    };

    chat.messages.push(message);
    await chat.save();

    res.json(message);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const markMessageRead = async (req: Request, res: Response) => {
  try {
    const chat = await Chat.findOne({ matchId: req.params.matchId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const message = chat.messages.find(
      (msg) => msg._id.toString() === req.params.messageId
    );
    if (message) {
      const userObjectId = new mongoose.Types.ObjectId(req.user!._id);
      if (!message.readBy.some((reader) => reader.toString() === userObjectId.toString())) {
        message.readBy.push(userObjectId);
        await chat.save();
      }
    }

    res.json({ message: 'Marked as read' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addReaction = async (req: Request, res: Response) => {
  try {
    const { emoji } = req.body;
    const chat = await Chat.findOne({ matchId: req.params.matchId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const message = chat.messages.find(
      (msg) => msg._id.toString() === req.params.messageId
    );
    if (message) {
      const existingReaction = message.reactions.find(
        (r) => r.userId.toString() === req.user!._id
      );
      if (existingReaction) {
        existingReaction.emoji = emoji;
      } else {
        message.reactions.push({
          userId: new mongoose.Types.ObjectId(req.user!._id),
          emoji,
        });
      }
      await chat.save();
    }

    res.json({ message: 'Reaction added' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversationStarters = async (req: Request, res: Response) => {
  try {
    // Placeholder - would use AI to generate starters
    const starters = [
      'What\'s something you\'re passionate about?',
      'Tell me about your perfect day',
      'What makes you feel most alive?',
    ];

    res.json({ starters });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

