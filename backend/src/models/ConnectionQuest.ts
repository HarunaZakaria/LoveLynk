import mongoose, { Schema, Document } from 'mongoose';

export interface IConnectionQuest extends Document {
  matchId: mongoose.Types.ObjectId;
  questType: 'conversation' | 'creative' | 'discovery' | 'future';
  title: string;
  description: string;
  prompt: string;
  responses: Array<{
    userId: mongoose.Types.ObjectId;
    response: string;
    submittedAt: Date;
  }>;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt?: Date;
  soulPointsEarned: number;
}

const ConnectionQuestSchema = new Schema<IConnectionQuest>(
  {
    matchId: {
      type: Schema.Types.ObjectId,
      ref: 'Match',
      required: true,
      index: true,
    },
    questType: {
      type: String,
      enum: ['conversation', 'creative', 'discovery', 'future'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    responses: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        response: {
          type: String,
          required: true,
        },
        submittedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending',
    },
    completedAt: {
      type: Date,
    },
    soulPointsEarned: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ConnectionQuestSchema.index({ matchId: 1, status: 1 });

export default mongoose.model<IConnectionQuest>('ConnectionQuest', ConnectionQuestSchema);

