import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  phone?: string;
  passwordHash?: string;
  authProvider: 'email' | 'google' | 'apple' | 'phone';
  profile: {
    firstName: string;
    age: number;
    gender: string;
    location: {
      city: string;
      state: string;
      country: string;
      coordinates: [number, number]; // [longitude, latitude]
    };
    photos: string[];
    verifiedPhotos: string[];
    bio: string;
    voiceIntro?: string;
    videoPrompts: Array<{
      promptId: string;
      videoUrl: string;
    }>;
    interests: string[];
    personalityProfile: {
      bigFive: {
        openness: number;
        conscientiousness: number;
        extraversion: number;
        agreeableness: number;
        neuroticism: number;
      };
      loveLanguages: string[];
      communicationStyle: string;
      conflictResolution: string;
      socialEnergy: number; // 0-100
      values: string[];
    };
    preferences: {
      ageRange: [number, number];
      maxDistance: number; // km
      genderPreferences: string[];
      dealBreakers: string[];
    };
    settings: {
      notifications: Record<string, boolean>;
      privacy: Record<string, boolean>;
      discovery: Record<string, any>;
    };
  };
  subscription: {
    tier: 'free' | 'premium' | 'elite';
    expiresAt?: Date;
  };
  stats: {
    matches: number;
    messagesSent: number;
    questsCompleted: number;
  };
  createdAt: Date;
  updatedAt: Date;
  lastActive: Date;
  isActive: boolean;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      sparse: true,
      unique: true,
      index: true,
    },
    passwordHash: {
      type: String,
    },
    authProvider: {
      type: String,
      enum: ['email', 'google', 'apple', 'phone'],
      default: 'email',
    },
    profile: {
      firstName: { type: String, required: true },
      age: { type: Number, required: true, min: 18, max: 100 },
      gender: { type: String, required: true },
      location: {
        city: { type: String, required: true },
        state: { type: String },
        country: { type: String, required: true },
        coordinates: {
          type: [Number],
          index: '2dsphere',
        },
      },
      photos: [{ type: String }],
      verifiedPhotos: [{ type: String }],
      bio: { type: String, maxlength: 500 },
      voiceIntro: { type: String },
      videoPrompts: [{
        promptId: { type: String },
        videoUrl: { type: String },
      }],
      interests: [{ type: String }],
      personalityProfile: {
        bigFive: {
          openness: { type: Number, min: 0, max: 100 },
          conscientiousness: { type: Number, min: 0, max: 100 },
          extraversion: { type: Number, min: 0, max: 100 },
          agreeableness: { type: Number, min: 0, max: 100 },
          neuroticism: { type: Number, min: 0, max: 100 },
        },
        loveLanguages: [{ type: String }],
        communicationStyle: { type: String },
        conflictResolution: { type: String },
        socialEnergy: { type: Number, min: 0, max: 100 },
        values: [{ type: String }],
      },
      preferences: {
        ageRange: { type: [Number], default: [18, 100] },
        maxDistance: { type: Number, default: 50 },
        genderPreferences: [{ type: String }],
        dealBreakers: [{ type: String }],
      },
      settings: {
        notifications: { type: Map, of: Boolean, default: {} },
        privacy: { type: Map, of: Boolean, default: {} },
        discovery: { type: Map, of: Schema.Types.Mixed, default: {} },
      },
    },
    subscription: {
      tier: {
        type: String,
        enum: ['free', 'premium', 'elite'],
        default: 'free',
      },
      expiresAt: { type: Date },
    },
    stats: {
      matches: { type: Number, default: 0 },
      messagesSent: { type: Number, default: 0 },
      questsCompleted: { type: Number, default: 0 },
    },
    lastActive: { type: Date, default: Date.now, index: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Indexes
UserSchema.index({ 'profile.location.coordinates': '2dsphere' });
UserSchema.index({ 'profile.age': 1 });
UserSchema.index({ 'subscription.tier': 1 });
UserSchema.index({ lastActive: -1 });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash') || !this.passwordHash) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Method to compare password
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  if (!this.passwordHash) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

export default mongoose.model<IUser>('User', UserSchema);

