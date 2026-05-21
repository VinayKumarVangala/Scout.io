# SYSTEM_ARCHITECTURE.md

# Project Title

Scout.io

> Multi-tenant pluggable AI chatbot infrastructure platform for embedding contextual AI assistants into client web applications.

---

# 1. Vision

Scout.io is designed as a modular, scalable, AI-powered chatbot platform where client applications can integrate a universal chatbot widget into their websites.

Each client (tenant) can:
- Upload knowledge bases
- Configure chatbot behavior
- Define response constraints
- Embed chatbot widgets into websites
- Allow anonymous users to interact with AI using tenant-specific knowledge

The system is built as a Proof-of-Concept (PoC) while maintaining production-grade architectural discipline for future scalability.

---

# 2. Core Goals

## Primary Goals

- Multi-tenant chatbot infrastructure
- Embeddable chatbot widget
- RAG-based contextual answering
- Tenant-isolated knowledge retrieval
- Free-tier sustainable deployment
- AI-agent-friendly modular codebase
- N8N-based orchestration pipelines
- Scalable layered architecture

---

# 3. High-Level Architecture

```text
                        ┌──────────────────────────┐
                        │  Client Web Application  │
                        └────────────┬─────────────┘
                                     │
                                     ▼
                        ┌──────────────────────────┐
                        │     Widget SDK Layer     │
                        │  (Embeddable Chatbot)    │
                        └────────────┬─────────────┘
                                     │ REST API
                                     ▼
                    ┌────────────────────────────────┐
                    │        API Gateway Layer       │
                    │ Authentication & Validation    │
                    └────────────┬───────────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          ▼                      ▼                      ▼
┌──────────────────┐  ┌────────────────────┐  ┌────────────────────┐
│ Tenant Management│  │  LLM Runtime Layer │  │ Observability Layer│
└─────────┬────────┘  └─────────┬──────────┘  └────────────────────┘
          │                     │
          ▼                     ▼
┌──────────────────┐  ┌────────────────────┐
│ PostgreSQL Layer │  │     RAG Layer      │
└──────────────────┘  └─────────┬──────────┘
                                 │
                                 ▼
                     ┌────────────────────────┐
                     │     Vector Database    │
                     │        (Qdrant)        │
                     └────────────────────────┘
                                 ▲
                                 │
                     ┌────────────────────────┐
                     │   Knowledge Ingestion  │
                     │      N8N Workflows     │
                     └────────────────────────┘
```

---

# 4. Architectural Principles

## 4.1 Modular Architecture

Every layer must:
- Have a single responsibility
- Be independently replaceable
- Be loosely coupled
- Expose clear interfaces

---

## 4.2 Multi-Tenant Isolation

All tenant data must remain logically isolated.

Isolation applies to:
- Knowledge base
- Vector embeddings
- Chat sessions
- Configurations
- Logs
- API access

Tenant isolation is enforced using:
- tenant_id mapping
- Vector namespaces
- Middleware validation
- API key ownership

---

## 4.3 AI-Agent-Friendly Structure

The entire repository should be:
- Machine-readable
- Clearly documented
- Modularized
- Predictably structured

This enables:
- AI-assisted coding
- Faster onboarding
- Easier maintenance
- Automated generation

---

## 4.4 Free-Tier Sustainability

Initial architecture must:
- Minimize infrastructure costs
- Use open-source tooling
- Support local development
- Avoid unnecessary managed services

---

# 5. Core System Layers

---

# 5.1 Widget SDK Layer

## Purpose

Provides embeddable chatbot functionality to client websites.

---

## Responsibilities

- Floating chatbot UI
- Session initialization
- Message rendering
- API communication
- Anonymous visitor handling
- Tenant identification
- UI branding

---

## Non-Responsibilities

- Knowledge retrieval
- Authentication logic
- AI inference
- Vector operations

---

## Technology Choices

| Component | Technology |
|---|---|
| Framework | React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Packaging | Vite |
| Isolation | Shadow DOM |

---

## Integration Pattern

```html
<script src="https://cdn.scout.io/widget.js"></script>
<script>
  ScoutChat.init({
    tenantId: "tenant_001",
    apiKey: "public_widget_key"
  })
</script>
```

---

# 5.2 API Gateway Layer

## Purpose

Central request handling layer.

---

## Responsibilities

- Request validation
- Tenant resolution
- API authentication
- Request routing
- Rate limiting
- Logging
- Middleware orchestration

---

## Technology Choices

| Component | Technology |
|---|---|
| Framework | FastAPI |
| Validation | Pydantic |
| Runtime | Uvicorn |
| API Docs | OpenAPI |

---

## Key APIs

| Endpoint | Purpose |
|---|---|
| POST /chat | User chat requests |
| POST /upload | Knowledge uploads |
| GET /health | Health checks |
| POST /tenant/create | Tenant onboarding |

---

# 5.3 Tenant Management Layer

## Purpose

Manages all tenant-level isolation and configuration.

---

## Responsibilities

- Tenant creation
- API key management
- Knowledge ownership
- Branding configs
- Tenant metadata
- Isolation enforcement

---

## Tenant Configuration Example

```json
{
  "tenant_id": "tenant_001",
  "name": "Acme Corp",
  "theme": {
    "primaryColor": "#2563eb"
  },
  "llm": {
    "provider": "openai",
    "model": "gpt-4.1-mini"
  },
  "limits": {
    "maxTokens": 1000
  }
}
```

---

# 5.4 RAG Layer

## Purpose

Responsible for contextual AI answering.

---

## Responsibilities

- Document chunking
- Embedding generation
- Vector retrieval
- Similarity search
- Context assembly

---

## Workflow

```text
User Query
    ↓
Embedding Generation
    ↓
Vector Search
    ↓
Top-K Retrieval
    ↓
Context Assembly
    ↓
LLM Prompt Injection
```

---

## Technology Choices

| Component | Technology |
|---|---|
| Vector DB | Qdrant |
| Embeddings | Sentence Transformers |
| Retrieval | Cosine Similarity |
| Chunking | Recursive Chunking |

---

# 5.5 Knowledge Ingestion Layer

## Purpose

Transforms uploaded knowledge into searchable embeddings.

---

## Responsibilities

- File validation
- Parsing
- Chunking
- Embedding generation
- Vector insertion

---

## Supported File Types (MVP)

| Type | Support |
|---|---|
| .md | Yes |
| .txt | Yes |
| .pdf | Future Phase |

---

## Ingestion Flow

```text
Upload
  ↓
Parse
  ↓
Normalize
  ↓
Chunk
  ↓
Embed
  ↓
Store in Qdrant
```

---

# 5.6 LLM Runtime Layer

## Purpose

Coordinates prompt construction and model interaction.

---

## Responsibilities

- Prompt engineering
- Context injection
- System instructions
- Response generation
- Output formatting

---

## Initial LLM Providers

| Provider | Usage |
|---|---|
| OpenAI | Primary |
| Gemini | Secondary |
| Ollama | Local Testing |

---

## Prompt Structure

```text
System Prompt
+
Tenant Constraints
+
Retrieved Context
+
User Query
```

---

# 5.7 Security Layer

## Purpose

Protects platform integrity and tenant isolation.

---

## Responsibilities

- Prompt injection prevention
- API validation
- Output filtering
- Rate limiting
- Input sanitization
- Tenant isolation enforcement

---

## MVP Security Measures

| Concern | Strategy |
|---|---|
| Prompt Injection | Prompt Wrapping |
| Abuse | Rate Limiting |
| Oversized Inputs | Token Limits |
| Unauthorized Access | API Validation |

---

# 5.8 Database Layer

## Purpose

Stores structured platform data.

---

## Technology Choices

| Component | Technology |
|---|---|
| Primary DB | PostgreSQL |
| ORM | SQLAlchemy |
| File Storage | Cloudflare R2 |

---

## Core Tables

| Table | Purpose |
|---|---|
| tenants | Tenant metadata |
| uploads | Knowledge uploads |
| api_keys | Authentication |
| configs | Tenant configs |
| logs | System logs |

---

# 5.9 N8N Workflow Layer

## Purpose

Automation and orchestration layer.

---

## Responsibilities

- Knowledge ingestion workflows
- Async processing
- Notifications
- Background automation

---

## N8N SHOULD HANDLE

- Upload processing
- Embedding workflows
- Scheduled jobs
- External integrations
- Retry workflows

---

## N8N SHOULD NOT HANDLE

- Real-time chat serving
- Authentication
- WebSocket handling
- API gateway logic
- Low-latency inference

---

# 5.10 Observability Layer

## Purpose

Tracks health, errors, and usage.

---

## Responsibilities

- Logging
- Error tracing
- Request monitoring
- Usage analytics
- Token tracking

---

## MVP Logging Strategy

| Type | Method |
|---|---|
| App Logs | Structured JSON |
| Error Logs | Centralized |
| Metrics | Basic Counters |

---

# 6. Data Flow Architecture

# 6.1 Chat Flow

```text
Visitor Message
    ↓
Widget SDK
    ↓
API Gateway
    ↓
Tenant Resolution
    ↓
RAG Retrieval
    ↓
LLM Runtime
    ↓
Response Generation
    ↓
Widget Rendering
```

---

# 6.2 Knowledge Upload Flow

```text
Tenant Upload
    ↓
Upload Validation
    ↓
N8N Trigger
    ↓
Parsing
    ↓
Chunking
    ↓
Embedding
    ↓
Qdrant Storage
```

---

# 7. Recommended Repository Structure

```text
/scout-io
│
├── /apps
│   ├── /api
│   ├── /widget
│   ├── /dashboard
│
├── /services
│   ├── /rag-service
│   ├── /embedding-service
│   ├── /tenant-service
│   ├── /llm-service
│
├── /workflows
│   ├── /n8n
│
├── /docs
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── DEVOPS.md
│   ├── SECURITY_MODEL.md
│   ├── API_CONTRACTS.md
│   ├── RAG_ARCHITECTURE.md
│
├── /infra
│   ├── docker-compose.yml
│   ├── kubernetes/
│
├── /shared
│   ├── /schemas
│   ├── /utils
│
└── README.md
```

---

# 8. Deployment Architecture

## MVP Free-Tier Deployment

| Component | Platform |
|---|---|
| API Backend | Render |
| Widget Hosting | Vercel |
| PostgreSQL | Supabase |
| Vector DB | Qdrant Cloud |
| Storage | Cloudflare R2 |
| N8N | Docker Self-Host |

---

# 9. Scalability Strategy

## Phase 1

- Anonymous sessions
- Markdown uploads
- Basic RAG
- Shared infrastructure

---

## Phase 2

- Streaming responses
- PDF parsing
- Chat history
- Dashboard analytics

---

## Phase 3

- Authenticated users
- Multi-model routing
- API integrations
- Human handoff
- Agentic workflows

---

# 10. Engineering Standards

## Naming Conventions

| Item | Convention |
|---|---|
| Variables | snake_case |
| Classes | PascalCase |
| APIs | kebab-case |
| Files | lowercase_with_underscores |

---

## Documentation Standards

Every module must include:

- Purpose
- Responsibilities
- Interfaces
- Inputs/Outputs
- Failure Cases
- Environment Variables
- Dependencies

---

# 11. Risks & Constraints

## Risks

- Prompt injection
- Tenant leakage
- Token cost scaling
- Hallucinations
- Embedding inconsistencies

---

## Constraints

- Free-tier infrastructure limits
- API rate limits
- Limited concurrent scaling
- Initial absence of persistent memory

---

# 12. Future Enhancements

- Streaming responses
- Voice interfaces
- Hybrid search
- Semantic caching
- Human escalation
- Enterprise RBAC
- On-prem deployment
- Multi-agent orchestration
- AI workflow builder

---

# 13. Final Architectural Philosophy

Scout.io is designed as:

- Modular
- Extensible
- AI-agent-friendly
- Multi-tenant-safe
- Infrastructure-conscious
- Developer-centric

The system prioritizes:

1. Clean boundaries
2. Maintainable architecture
3. Tenant isolation
4. Sustainable scalability
5. Low-cost experimentation
6. Future extensibility

The platform intentionally separates:

- UI Layer
- Runtime Layer
- Retrieval Layer
- Orchestration Layer
- Infrastructure Layer

This separation ensures long-term maintainability and scalable evolution of the platform.

