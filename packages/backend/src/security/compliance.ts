import { ConversationModel } from '../models/Conversation.model';

export class ComplianceService {
  /**
   * GDPR: Right to be forgotten
   */
  public static async deleteUserData(clientId: string, userId: string): Promise<number> {
    const result = await ConversationModel.deleteMany({ clientId, userId });
    console.log(`[Compliance] Deleted ${result.deletedCount} records for user ${userId} (Client: ${clientId})`);
    return result.deletedCount;
  }

  /**
   * GDPR: Right to access data
   */
  public static async exportUserData(clientId: string, userId: string) {
    const conversations = await ConversationModel.find({ clientId, userId }).lean();
    return {
      userId,
      clientId,
      exportedAt: new Date().toISOString(),
      data: conversations
    };
  }
}
