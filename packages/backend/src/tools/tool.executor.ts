import { proxyEngine } from '../proxy/proxy.engine';
import { ToolCall } from '@scout-io/shared';

export class ToolExecutor {
  public async executeTool(clientId: string, toolCall: ToolCall): Promise<any> {
    const { name, arguments: argsString } = toolCall.function;
    const args = JSON.parse(argsString);

    console.log(`[Tool] Executing ${name} for client ${clientId}`);

    switch (name) {
      case 'call_api':
        return await proxyEngine.handleRequest(clientId, {
          url: args.url,
          method: args.method || 'GET',
          headers: args.headers,
          body: args.body,
        });
      
      case 'get_weather':
        // Simplified built-in tool
        return { temperature: 22, condition: 'Sunny', location: args.location };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}

export const toolExecutor = new ToolExecutor();
