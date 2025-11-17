import { Request, Response } from 'express';
import User from '../models/User';
import { uploadToS3 } from '../utils/s3';

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!._id).select('-passwordHash');
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update current user
// @route   PUT /api/users/me
// @access  Private
export const updateMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { $set: req.body, lastActive: new Date() },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-passwordHash -email -phone -settings')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload photo
// @route   POST /api/users/upload-photo
// @access  Private
export const uploadPhoto = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = await uploadToS3(req.file, 'photos');
    const user = await User.findById(req.user!._id);

    if (user) {
      user.profile.photos.push(fileUrl);
      await user.save();
    }

    res.json({ url: fileUrl });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete photo
// @route   DELETE /api/users/photos/:photoId
// @access  Private
export const deletePhoto = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!._id);
    if (user) {
      user.profile.photos = user.profile.photos.filter(
        (photo) => photo !== req.params.photoId
      );
      await user.save();
    }
    res.json({ message: 'Photo deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload voice intro
// @route   POST /api/users/voice-intro
// @access  Private
export const uploadVoiceIntro = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No audio file uploaded' });
    }

    const fileUrl = await uploadToS3(req.file, 'audio');
    const user = await User.findById(req.user!._id);

    if (user) {
      user.profile.voiceIntro = fileUrl;
      await user.save();
    }

    res.json({ url: fileUrl });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload video prompt
// @route   POST /api/users/video-prompt
// @access  Private
export const uploadVideoPrompt = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const { promptId } = req.body;
    const fileUrl = await uploadToS3(req.file, 'videos');
    const user = await User.findById(req.user!._id);

    if (user) {
      user.profile.videoPrompts.push({ promptId, videoUrl: fileUrl });
      await user.save();
    }

    res.json({ url: fileUrl });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update preferences
// @route   PUT /api/users/preferences
// @access  Private
export const updatePreferences = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!._id);
    if (user) {
      user.profile.preferences = { ...user.profile.preferences, ...req.body };
      await user.save();
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update settings
// @route   PUT /api/users/settings
// @access  Private
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!._id);
    if (user) {
      user.profile.settings = { ...user.profile.settings, ...req.body };
      await user.save();
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!._id).select('stats');
    res.json(user?.stats);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

