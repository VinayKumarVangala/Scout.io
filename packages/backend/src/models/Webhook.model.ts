import mongoose, { Schema, Document } from 'mongoose';

export interface WebhookDocument extends Document {
  clientId: mongoose.Types.ObjectId;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
}

const WebhookSchema: Schema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  url: { type: String, required: true },
  events: [{ type: String, required: true }], // e.g., 'message.sent', 'conversation.started'
  secret: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

WebhookSchema.index({ clientId: 1 });

export const WebhookModel = mongoose.model<WebhookDocument>('Webhook', WebhookSchema);
