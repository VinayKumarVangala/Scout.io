import mongoose, { Schema, Document } from 'mongoose';

export interface ApiKeyDocument extends Document {
  clientId: mongoose.Types.ObjectId;
  provider: string;
  key: string; // Encrypted
  isActive: boolean;
}

const ApiKeySchema: Schema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  provider: { type: String, required: true },
  key: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

ApiKeySchema.index({ clientId: 1, provider: 1 }, { unique: true });

export const ApiKeyModel = mongoose.model<ApiKeyDocument>('ApiKey', ApiKeySchema);
