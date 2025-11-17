import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  users: mongoose.Types.ObjectId[];
  matchedAt: Date;
  soulDensityScore: number; // 0-100
  scoreBreakdown: {
    personality: number;
    communication: number;
    values: number;
    interests: number;
    lifestyle: number;
  };
  status: 'matched' | 'conversing' | 'met' | 'unmatched';
  lastInteraction: Date;
  questsCompleted: mongoose.Types.ObjectId[];
  compatibilityInsights: Array<{
    date: Date;
    insight: string;
    scoreChange: number;
  }>;
}

const MatchSchema = new Schema<IMatch>(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    matchedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    soulDensityScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      index: true,
    },
    scoreBreakdown: {
      personality: { type: Number, min: 0, max: 100 },
      communication: { type: Number, min: 0, max: 100 },
      values: { type: Number, min: 0, max: 100 },
      interests: { type: Number, min: 0, max: 100 },
      lifestyle: { type: Number, min: 0, max: 100 },
    },
    status: {
      type: String,
      enum: ['matched', 'conversing', 'met', 'unmatched'],
      default: 'matched',
    },
    lastInteraction: {
      type: Date,
      default: Date.now,
    },
    questsCompleted: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ConnectionQuest',
      },
    ],
    compatibilityInsights: [
      {
        date: { type: Date, default: Date.now },
        insight: { type: String },
        scoreChange: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user match queries
MatchSchema.index({ users: 1 });
MatchSchema.index({ matchedAt: -1 });
MatchSchema.index({ soulDensityScore: -1 });

export default mongoose.model<IMatch>('Match', MatchSchema);

