import axios, { AxiosInstance } from 'axios';
import { RequestSanitizer } from './security/request.sanitizer';

export class ProxyExecutor {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      timeout: 30000,
      validateStatus: (status) => status < 500,
    });
  }

  public async execute(request: {
    url: string;
    method: string;
    headers?: Record<string, string>;
    body?: any;
  }) {
    const sanitizedUrl = RequestSanitizer.sanitizeUrl(request.url);
    const sanitizedHeaders = RequestSanitizer.sanitizeHeaders(request.headers || {});

    try {
      const response = await this.client.request({
        url: sanitizedUrl,
        method: request.method,
        headers: sanitizedHeaders,
        data: request.body,
      });

      return {
        status: response.status,
        data: response.data,
        headers: response.headers,
      };
    } catch (error: any) {
      console.error('Proxy Execution Error:', error.message);
      throw new Error(`Proxy execution failed: ${error.message}`);
    }
  }
}

export const proxyExecutor = new ProxyExecutor();
