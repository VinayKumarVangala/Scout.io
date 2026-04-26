import mongoose, { Schema, Document } from 'mongoose';
import { Message } from '@scout-io/shared';

export interface ConversationDocument extends Document {
  clientId: mongoose.Types.ObjectId;
  userId: string; // Unique ID for the chat user on client site
  messages: Message[];
  metadata: Record<string, any>;
}

const ConversationSchema: Schema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  userId: { type: String, required: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Number, default: Date.now },
  }],
  metadata: { type: Map, of: Schema.Types.Mixed },
}, { timestamps: true });

ConversationSchema.index({ clientId: 1, userId: 1 });
ConversationSchema.index({ createdAt: -1 });

export const ConversationModel = mongoose.model<ConversationDocument>('Conversation', ConversationSchema);
