"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.llmConfigSchema = exports.proxyRequestSchema = exports.messageSchema = exports.clientRegistrationSchema = void 0;
const zod_1 = require("zod");
exports.clientRegistrationSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    domains: zod_1.z.array(zod_1.z.string().url()),
    settings: zod_1.z.object({
        theme: zod_1.z.object({
            primaryColor: zod_1.z.string().regex(/^#[0-9A-F]{6}$/i),
            secondaryColor: zod_1.z.string().regex(/^#[0-9A-F]{6}$/i),
            logoUrl: zod_1.z.string().url().optional(),
        }),
        llmConfig: zod_1.z.object({
            provider: zod_1.z.enum(['openai', 'gemini', 'ollama', 'groq', 'openrouter', 'huggingface']),
            model: zod_1.z.string(),
            temperature: zod_1.z.number().min(0).max(2).optional(),
            maxTokens: zod_1.z.number().positive().optional(),
        }),
    }),
});
exports.messageSchema = zod_1.z.object({
    role: zod_1.z.enum(['user', 'assistant', 'system']),
    content: zod_1.z.string(),
    timestamp: zod_1.z.number(),
});
exports.proxyRequestSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
    method: zod_1.z.enum(['GET', 'POST', 'PUT', 'DELETE']),
    headers: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
    body: zod_1.z.any().optional(),
});
exports.llmConfigSchema = zod_1.z.object({
    provider: zod_1.z.enum(['openai', 'gemini', 'ollama', 'groq', 'openrouter', 'huggingface']),
    model: zod_1.z.string(),
    temperature: zod_1.z.number().optional(),
    maxTokens: zod_1.z.number().optional(),
});
