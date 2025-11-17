import mongoose, { Schema, Document } from 'mongoose';

export interface ISwipe extends Document {
  swiperId: mongoose.Types.ObjectId;
  swipedId: mongoose.Types.ObjectId;
  action: 'like' | 'pass' | 'superSwipe';
  timestamp: Date;
  compatibilityScore: number; // At time of swipe
  indexed: boolean; // For recommendation algorithm
}

const SwipeSchema = new Schema<ISwipe>(
  {
    swiperId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    swipedId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ['like', 'pass', 'superSwipe'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    compatibilityScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    indexed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate swipes
SwipeSchema.index({ swiperId: 1, swipedId: 1 }, { unique: true });

export default mongoose.model<ISwipe>('Swipe', SwipeSchema);

