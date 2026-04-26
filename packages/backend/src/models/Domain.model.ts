import mongoose, { Schema, Document } from 'mongoose';

export interface DomainDocument extends Document {
  clientId: mongoose.Types.ObjectId;
  domain: string;
  isActive: boolean;
}

const DomainSchema: Schema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  domain: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

DomainSchema.index({ domain: 1 });
DomainSchema.index({ clientId: 1 });

export const DomainModel = mongoose.model<DomainDocument>('Domain', DomainSchema);
