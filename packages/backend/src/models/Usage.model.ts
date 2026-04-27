import mongoose, { Schema, Document } from 'mongoose';

export interface UsageDocument extends Document {
  clientId: mongoose.Types.ObjectId;
  provider: string;
  llmModel: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
}

const UsageSchema: Schema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  provider: { type: String, required: true },
  llmModel: { type: String, required: true },
  promptTokens: { type: Number, default: 0 },
  completionTokens: { type: Number, default: 0 },
  totalTokens: { type: Number, default: 0 },
  cost: { type: Number, default: 0 },
}, { timestamps: true });

UsageSchema.index({ clientId: 1, createdAt: -1 });

export const UsageModel = mongoose.model<UsageDocument>('Usage', UsageSchema);
