# Scout.io 🚀

**Multi-Tenant Proxy-Based AI Chat Layer (Elite Architecture)**

Scout.io is a secure, embeddable chatbot platform that integrates into any web application via a lightweight script snippet. It features a hybrid architecture with a persistent backend core, a multi-tenant isolation layer, and a pluggable LLM provider system.

## 🏗 Project Structure

- `packages/backend`: Node.js Express server handling the Proxy Engine, LLM Adapters, and Business Logic.
- `packages/frontend`: Next.js Admin Dashboard for managing clients, APIs, and configurations.
- `packages/widget`: Vanilla JS chat widget for embedding into client websites.
- `packages/shared`: Shared TypeScript types and utility functions.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account
- Upstash Redis account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `packages/backend/.env` and fill in the values.

### Development

Run the entire stack in development mode:
```bash
npm run dev
```

## 🛠 Tech Stack

- **Backend**: Node.js, Express, WebSocket, MongoDB, Redis
- **Frontend**: Next.js, Tailwind CSS
- **Widget**: Vanilla JS, Vite
- **Language**: TypeScript

## 🔒 Security Features

- AES-256 Secret Encryption
- JWT-based authentication
- Multi-tenant data isolation
- Domain whitelisting for widgets
