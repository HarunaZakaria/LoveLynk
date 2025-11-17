import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  _id: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content: string;
  type: 'text' | 'audio' | 'image' | 'quest';
  audioUrl?: string;
  readBy: mongoose.Types.ObjectId[];
  reactions: Array<{
    userId: mongoose.Types.ObjectId;
    emoji: string;
  }>;
  createdAt: Date;
}

export interface IChat extends Document {
  matchId: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  messages: IMessage[];
  conversationStarters: Array<{
    suggestedAt: Date;
    starter: string;
    used: boolean;
  }>;
}

const MessageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'audio', 'image', 'quest'],
      default: 'text',
    },
    audioUrl: {
      type: String,
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    reactions: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        emoji: { type: String },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const ChatSchema = new Schema<IChat>(
  {
    matchId: {
      type: Schema.Types.ObjectId,
      ref: 'Match',
      required: true,
      unique: true,
      index: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    messages: [MessageSchema],
    conversationStarters: [
      {
        suggestedAt: { type: Date, default: Date.now },
        starter: { type: String },
        used: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

ChatSchema.index({ participants: 1 });
ChatSchema.index({ updatedAt: -1 });

export default mongoose.model<IChat>('Chat', ChatSchema);

