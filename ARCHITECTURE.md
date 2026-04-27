# 🏗 Scout.io System Architecture

This document outlines the architectural patterns, directory structure, and logical flow of the Scout.io platform.

---

## 📂 Project Structure

Scout.io is a TypeScript monorepo using **npm workspaces**.

### 1. `packages/shared`
**Purpose**: The single source of truth for types, constants, and validation logic used by both the Backend, Frontend, and Widget.
- **`src/types/`**: TypeScript interfaces and types for all core entities (Client, Message, ToolCall).
- **`src/constants/`**: Global constants, error codes, and configuration defaults.
- **`src/utils/validation.ts`**: Zod schemas for runtime data validation (e.g., API requests).

### 2. `packages/backend` (Elite Runtime)
**Purpose**: A secure, persistent Express service that orchestrates LLM interactions and secure proxy executions.
- **`src/llm/`**: Pluggable adapter system for different AI providers (OpenAI, Gemini, etc.).
- **`src/proxy/`**: The core execution engine for tool-calling, featuring header sanitization and HMAC signature verification.
- **`src/models/`**: Mongoose schemas for MongoDB (Multi-tenant data isolation).
- **`src/repositories/`**: Data access layer to abstract database operations.
- **`src/services/`**: Business logic (JWT management, Webhooks, Encryption).
- **`src/middleware/`**: Security layer (Rate limiting, Tenant isolation, Auth).
- **`src/test/`**: Unit and integration tests using Jest and MongoDB Memory Server.

### 3. `packages/widget` (Embeddable UI)
**Purpose**: A lightweight, isolated chat interface served via CDN.
- **`src/core/`**: Shadow DOM creation and iframe isolation logic.
- **`src/components/`**: Modular UI components (FAB, Chat Window, Message List).
- **`src/streaming/`**: Real-time token delivery via WebSockets and SSE.
- **`src/styles/`**: Custom CSS-in-JS and theme injection system.

### 4. `packages/frontend` (Admin Dashboard)
**Purpose**: Next.js App Router application for platform administration.
- **`src/app/`**: Route-based pages for Client management, Provider config, and Analytics.
- **`src/store/`**: Global state management using Zustand with persistence.
- **`src/components/`**: High-fidelity UI components for the dashboard interface.

### 5. `packages/docs` (Developer Portal)
**Purpose**: Next.js documentation site for onboarding and API reference.

---

## 🔄 Core Logical Flows

### 1. The Chat Loop
1. **Widget** sends a message via WebSocket to the **Backend**.
2. **Backend** identifies the **Tenant** (Client ID) and loads their LLM configuration.
3. **LLM Service** calls the selected provider (e.g., OpenAI).
4. If the LLM requests a **Tool Call**, the **Proxy Engine** executes it securely.
5. Response is **streamed** back to the Widget in real-time.

### 2. Multi-Tenant Security
- **Domain Whitelisting**: The `tenantMiddleware` verifies the `Origin` header against the client's registered domains.
- **Data Isolation**: Every database query is scoped by `clientId`.
- **Secret Management**: All client-specific API keys are stored encrypted at rest (AES-256).

### 3. Secure Proxy Execution
- **Sanitization**: The Proxy Engine strips sensitive headers (Cookies, Authorization) before forwarding requests to internal APIs.
- **Signing**: Outbound requests can be signed with an HMAC signature for destination verification.
