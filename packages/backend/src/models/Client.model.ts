import mongoose, { Schema, Document } from 'mongoose';
import { Client as IClient } from '@scout-io/shared';

export interface ClientDocument extends Omit<IClient, 'id'>, Document {}

const ClientSchema: Schema = new Schema({
  name: { type: String, required: true },
  domains: [{ type: String, required: true }],
  settings: {
    theme: {
      primaryColor: { type: String, default: '#000000' },
      secondaryColor: { type: String, default: '#ffffff' },
      logoUrl: { type: String },
    },
    llmConfig: {
      provider: { type: String, required: true },
      model: { type: String, required: true },
      temperature: { type: Number, default: 0.7 },
      maxTokens: { type: Number, default: 1000 },
    },
  },
}, { timestamps: true });

ClientSchema.index({ name: 1 });
ClientSchema.index({ domains: 1 });

export const ClientModel = mongoose.model<ClientDocument>('Client', ClientSchema);
