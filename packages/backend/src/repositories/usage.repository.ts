import { UsageModel, UsageDocument } from '../models/Usage.model';
import mongoose from 'mongoose';

export class UsageRepository {
  async logUsage(data: Partial<UsageDocument>): Promise<UsageDocument> {
    const usage = new UsageModel(data);
    return await usage.save();
  }

  async getClientUsage(clientId: string, startDate: Date, endDate: Date) {
    return await UsageModel.aggregate([
      {
        $match: {
          clientId: new mongoose.Types.ObjectId(clientId),
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$model',
          totalPromptTokens: { $sum: '$promptTokens' },
          totalCompletionTokens: { $sum: '$completionTokens' },
          totalTokens: { $sum: '$totalTokens' },
          totalCost: { $sum: '$cost' },
          count: { $sum: 1 }
        }
      }
    ]);
  }
}

export const usageRepository = new UsageRepository();
