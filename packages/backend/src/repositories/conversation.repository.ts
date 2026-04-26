import { ConversationModel, ConversationDocument } from '../models/Conversation.model';
import { Message } from '@scout-io/shared';

export class ConversationRepository {
  async findOrCreate(clientId: string, userId: string): Promise<ConversationDocument> {
    let conversation = await ConversationModel.findOne({ clientId, userId });
    if (!conversation) {
      conversation = new ConversationModel({ clientId, userId, messages: [] });
      await conversation.save();
    }
    return conversation;
  }

  async addMessage(clientId: string, userId: string, message: Message): Promise<void> {
    await ConversationModel.updateOne(
      { clientId, userId },
      { $push: { messages: message } }
    );
  }

  async getHistory(clientId: string, userId: string, limit: number = 20, offset: number = 0): Promise<Message[]> {
    const conversation = await ConversationModel.findOne({ clientId, userId })
      .slice('messages', [offset, limit]);
    return conversation?.messages || [];
  }
}

export const conversationRepository = new ConversationRepository();
