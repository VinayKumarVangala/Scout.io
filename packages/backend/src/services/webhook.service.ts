import axios from 'axios';
import crypto from 'crypto';
import { WebhookModel } from '../models/Webhook.model';

export class WebhookService {
  public static async trigger(clientId: string, event: string, payload: any) {
    const webhooks = await WebhookModel.find({ clientId, events: event, isActive: true });

    for (const webhook of webhooks) {
      this.deliver(webhook, event, payload);
    }
  }

  private static async deliver(webhook: any, event: string, payload: any) {
    const timestamp = Date.now();
    const body = JSON.stringify({ event, payload, timestamp });
    
    // Generate HMAC signature
    const signature = crypto
      .createHmac('sha256', webhook.secret)
      .update(body)
      .digest('hex');

    try {
      await axios.post(webhook.url, body, {
        headers: {
          'Content-Type': 'application/json',
          'x-scout-signature': signature,
          'x-scout-event': event,
        },
        timeout: 5000,
      });
      console.log(`[Webhook] Delivered ${event} to ${webhook.url}`);
    } catch (error: any) {
      console.error(`[Webhook] Delivery failed to ${webhook.url}:`, error.message);
      // Logic for retries could go here
    }
  }
}
