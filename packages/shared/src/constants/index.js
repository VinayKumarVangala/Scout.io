"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_CODES = exports.DEFAULT_MODELS = exports.SUPPORTED_PROVIDERS = void 0;
exports.SUPPORTED_PROVIDERS = [
    'openai',
    'gemini',
    'ollama',
    'groq',
    'openrouter',
    'huggingface'
];
exports.DEFAULT_MODELS = {
    openai: 'gpt-4o',
    gemini: 'gemini-1.5-pro',
    ollama: 'llama3',
    groq: 'llama3-70b-8192',
    openrouter: 'openai/gpt-3.5-turbo',
    huggingface: 'mistralai/Mistral-7B-v0.1'
};
exports.ERROR_CODES = {
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    LLM_PROVIDER_ERROR: 'LLM_PROVIDER_ERROR',
    PROXY_ERROR: 'PROXY_ERROR',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
};
