import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  clientId: { type: String },
  userId: { type: String },
  details: { type: Map, of: mongoose.Schema.Types.Mixed },
  ip: { type: String },
  userAgent: { type: String },
  severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' },
  createdAt: { type: Date, default: Date.now },
});

const AuditLogModel = mongoose.model('AuditLog', AuditLogSchema);

export class AuditLogger {
  public static async log(data: {
    action: string;
    clientId?: string;
    userId?: string;
    details?: any;
    severity?: 'info' | 'warning' | 'critical';
    req?: any;
  }) {
    try {
      await AuditLogModel.create({
        ...data,
        ip: data.req?.ip,
        userAgent: data.req?.headers['user-agent'],
      });
    } catch (error) {
      console.error('Audit Logging Failed:', error);
    }
  }
}
