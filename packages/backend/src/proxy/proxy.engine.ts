import { proxyExecutor } from './proxy.executor';
import { ProxyRequest, ProxyResponse } from '@scout-io/shared';

export class ProxyEngine {
  public async handleRequest(clientId: string, request: ProxyRequest): Promise<ProxyResponse> {
    // 1. Verify client permissions (Placeholder for complex ACL)
    // In a real app, you'd check if this clientId is allowed to call this URL
    
    console.log(`[Proxy] Client ${clientId} requesting ${request.url}`);

    // 2. Execute
    const response = await proxyExecutor.execute(request);

    // 3. Return sanitized response
    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>,
    };
  }
}

export const proxyEngine = new ProxyEngine();
