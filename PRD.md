# 📘 Product Requirements Document (PRD)

# 🏷 Product Name
**Scout.io – Multi-Tenant Proxy-Based AI Chat Layer (Elite Architecture)**

---

# 1️⃣ Product Overview

Scout.io is a secure, embeddable chatbot platform that integrates into any web application via a lightweight script snippet. It appears as a floating chat button and expands into a floating chat interface.

This version follows a **Hybrid Elite Architecture**:

- Frontend & Widget served via CDN (Vercel)
- Backend deployed as persistent service (Render / Railway / Fly.io)
- Secure Proxy API execution
- Multi-tenant isolation
- Pluggable LLM provider architecture

---

# 2️⃣ Vision

To build a scalable AI middleware platform that acts as a universal conversational layer for web applications, with no vendor lock-in and no exposure of sensitive credentials.

---

# 3️⃣ Architecture Strategy (Elite Mode)

## Hybrid Deployment Model

### Layer 1: CDN Layer (Vercel - Free Tier)
- widget.js delivery
- Admin dashboard (Next.js)
- Marketing site
- Static assets

### Layer 2: Backend Core (Persistent Runtime)
- Node.js + Express server
- WebSocket support
- API Proxy Engine
- LLM Adapter Layer
- Multi-tenant enforcement
- Secret vault service

Recommended Free Hosting Options:
- Render (Free Web Service)
- Railway (Starter plan)
- Fly.io (Free tier)

### Layer 3: Data & Cache
- MongoDB Atlas (Free Tier)
- Upstash Redis (Free Tier)

---

# 4️⃣ System Architecture

Client Website
        ↓
CDN Widget (Vercel)
        ↓
Persistent Backend (Render/Railway/Fly)
        ↓
LLM Adapter Layer
        ↓
Selected LLM Provider

Parallel Connections:
- Client APIs (Proxy Execution)
- MongoDB Atlas
- Upstash Redis

---

# 5️⃣ Core Features

## 5.1 Floating Widget

- Shadow DOM isolation
- Lightweight Vanilla JS
- Configurable themes
- Streaming message rendering
- Secure handshake with backend

Integration:

```html
<script src="https://Scout.vercel.app/widget.js"
        data-client-id="CLIENT_ID"
        async>
</script>
```

---

## 5.2 Secure Proxy Engine

- Server-side API execution only
- Encrypted secrets (AES-256)
- Per-client API scope
- JWT validation
- Rate limiting middleware
- Structured tool execution layer

---

## 5.3 Multi-Tenant Enforcement

Every request must include:
- clientId
- validated domain
- optional signed JWT

All database queries scoped by clientId.

---

## 5.4 LLM Provider Abstraction Layer

Supported Providers:

- OpenAI API
- Google Gemini API
- Ollama (self-hosted)
- Groq API
- OpenRouter API
- HuggingFace Inference API

### Adapter Design

Unified Interface:

```
invokeLLM({
  provider,
  model,
  messages,
  tools,
  stream
})
```

Each provider has its own adapter:
- openai.adapter.js
- gemini.adapter.js
- ollama.adapter.js
- groq.adapter.js
- openrouter.adapter.js
- huggingface.adapter.js

### Features

- Streaming support
- Tool calling normalization
- Failover routing
- Provider fallback logic

---

# 6️⃣ Best Reliable & Free Tech Stack

## Frontend
- Next.js (Vercel Free)
- Vanilla JS Widget
- Tailwind CSS

## Backend
- Node.js
- Express.js
- ws (WebSocket library)
- Axios (proxy calls)
- Zod (input validation)

## Database
- MongoDB Atlas (Free Tier)

## Cache
- Upstash Redis (Free Tier)

## Secrets Management
- Environment variables (backend only)
- Encrypted storage in MongoDB

## DevOps
- GitHub
- GitHub Actions (Free CI/CD)
- Docker (Optional for production upgrade)

---

# 7️⃣ Development Workflow

## Phase 1 – Core Backend

1. Setup Express backend
2. Implement client registration
3. Implement API proxy engine
4. Build LLM abstraction layer
5. Add streaming support

## Phase 2 – Widget

1. Build floating button
2. Build chat UI
3. Add secure backend connection
4. Implement streaming rendering

## Phase 3 – Admin Dashboard

1. Client management
2. API registration panel
3. LLM provider configuration
4. Secret storage management

## Phase 4 – Security Hardening

1. JWT verification
2. Domain whitelisting
3. Rate limiting
4. Prompt injection mitigation
5. Tenant isolation testing

## Phase 5 – Deployment

1. Deploy frontend to Vercel
2. Deploy backend to Render/Railway/Fly
3. Connect MongoDB Atlas
4. Connect Upstash Redis
5. Configure environment variables

---

# 8️⃣ Functional Requirements

| ID | Requirement |
|----|------------|
| FR1 | Widget loads < 2s |
| FR2 | Persistent backend runtime |
| FR3 | WebSocket streaming |
| FR4 | Multi-LLM support |
| FR5 | Per-client isolation |
| FR6 | API proxy encryption |
| FR7 | Failover support |
| FR8 | Admin dashboard |

---

# 9️⃣ Non-Functional Requirements

## Security
- HTTPS everywhere
- AES-256 encryption
- Strict CORS
- Rate limiting
- Input validation

## Performance
- < 500ms proxy overhead
- Horizontal scaling capability
- Streaming latency < 300ms

## Scalability
- Stateless backend
- Redis caching
- Load balancer ready

---

# 🔟 Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Server cold starts | Use persistent backend hosting |
| Provider downtime | Multi-provider failover |
| Data leakage | Strict clientId scoping |
| Abuse | Rate limiting + logging |

---

# 1️⃣1️⃣ Success Metrics

- 99% uptime
- <2s average response
- Zero cross-tenant data leaks
- Successful provider switching

---

# Final Definition

Scout.io (Elite Mode) is a hybrid-deployed, multi-tenant AI middleware platform with secure proxy-based API access, pluggable LLM providers, persistent backend runtime, and CDN-optimized widget delivery — designed for scalable SaaS-level deployment.

