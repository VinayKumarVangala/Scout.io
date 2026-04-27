export type LLMProvider = 'openai' | 'gemini' | 'ollama' | 'groq' | 'openrouter' | 'huggingface';

export interface ClientSettings {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
  };
  llmConfig: {
    provider: LLMProvider;
    model: string;
    temperature?: number;
    maxTokens?: number;
  };
}

export interface Client {
  id: string;
  name: string;
  domains: string[];
  settings: ClientSettings;
  createdAt: string;
  updatedAt: string;
}

export interface ClientRegistration {
  name: string;
  domains: string[];
  settings: ClientSettings;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface ProxyRequest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

export interface ProxyResponse {
  status: number;
  data: any;
  headers: Record<string, string>;
}

export interface JWTPayload {
  clientId: string;
  domain: string;
  iat?: number;
  exp?: number;
}
