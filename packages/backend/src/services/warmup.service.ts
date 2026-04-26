import { ClientModel } from '../models/Client.model';
import { clientCache } from '../cache/client.cache';

export class WarmupService {
  public async warmup() {
    console.log('🔥 Starting cache warmup...');
    try {
      // Warm up active clients
      const activeClients = await ClientModel.find({}).limit(100);
      for (const client of activeClients) {
        // We convert document to plain object for caching
        const clientObj = client.toObject();
        // clientObj.id = clientObj._id.toString(); // Ensure ID is string
        await clientCache.set(client._id.toString(), clientObj as any);
      }
      console.log(`✅ Warmed up ${activeClients.length} clients in cache`);
    } catch (error) {
      console.error('❌ Cache warmup failed:', error);
    }
  }
}

export const warmupService = new WarmupService();
