import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Generate JWT Token
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
};

const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, age, gender } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      email,
      passwordHash: password,
      authProvider: 'email',
      profile: {
        firstName,
        age,
        gender,
        location: {
          city: '',
          country: '',
          coordinates: [0, 0],
        },
        photos: [],
        verifiedPhotos: [],
        bio: '',
        videoPrompts: [],
        interests: [],
        personalityProfile: {
          bigFive: {
            openness: 50,
            conscientiousness: 50,
            extraversion: 50,
            agreeableness: 50,
            neuroticism: 50,
          },
          loveLanguages: [],
          communicationStyle: '',
          conflictResolution: '',
          socialEnergy: 50,
          values: [],
        },
        preferences: {
          ageRange: [18, 100],
          maxDistance: 50,
          genderPreferences: [],
          dealBreakers: [],
        },
        settings: {
          notifications: {},
          privacy: {},
          discovery: {},
        },
      },
    });

    const token = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.status(201).json({
      _id: user._id.toString(),
      email: user.email,
      user: {
        _id: user._id.toString(),
        email: user.email,
      },
      token,
      refreshToken,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && user.passwordHash && (await user.matchPassword(password))) {
      // Update last active
      user.lastActive = new Date();
      await user.save();

      const token = generateToken(user._id.toString());
      const refreshToken = generateRefreshToken(user._id.toString());

      res.json({
        _id: user._id.toString(),
        email: user.email,
        user: {
          _id: user._id.toString(),
          email: user.email,
        },
        token,
        refreshToken,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response) => {
  // In a real app, you'd invalidate the refresh token in Redis
  res.json({ message: 'Logged out successfully' });
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { userId: string };

    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    const newToken = generateToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());

    res.json({
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error: any) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// Placeholder implementations
export const forgotPassword = async (req: Request, res: Response) => {
  res.json({ message: 'Password reset email sent' });
};

export const resetPassword = async (req: Request, res: Response) => {
  res.json({ message: 'Password reset successfully' });
};

export const verifyEmail = async (req: Request, res: Response) => {
  res.json({ message: 'Email verified' });
};

export const verifyPhone = async (req: Request, res: Response) => {
  res.json({ message: 'Phone verified' });
};

export const googleAuth = async (req: Request, res: Response) => {
  res.json({ message: 'Google auth - to be implemented' });
};

export const appleAuth = async (req: Request, res: Response) => {
  res.json({ message: 'Apple auth - to be implemented' });
};

