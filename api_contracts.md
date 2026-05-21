# API_CONTRACTS.md

# Project Title

Scout.io

> API contract specification for the Scout.io multi-tenant AI chatbot platform.

---

# 1. Purpose

This document defines:

- API standards
- Request/response schemas
- Authentication contracts
- Tenant resolution rules
- Error handling contracts
- Widget communication standards
- Upload contracts
- Future extensibility guidelines

The API architecture is designed for:

- Multi-tenant isolation
- AI-agent-friendly implementation
- Consistent backend communication
- Modular scalability
- Future streaming support

---

# 2. API Design Philosophy

Scout.io APIs must be:

- Predictable
- Versioned
- Stateless
- Secure
- Tenant-aware
- Machine-readable
- Frontend-friendly
- Extensible

---

# 3. API Standards

# 3.1 Base URL

```text
https://api.scout.io/api/v1
```

---

# 3.2 API Versioning

## Versioning Strategy

URI-based versioning.

Example:

```text
/api/v1/chat
```

---

# 3.3 Data Format

## Standard Format

JSON.

---

## Content-Type

```http
Content-Type: application/json
```

---

# 3.4 Naming Convention

| Resource | Convention |
|---|---|
| Endpoints | kebab-case |
| JSON keys | snake_case |
| Headers | Pascal-Case |

---

# 4. Authentication Architecture

# 4.1 Authentication Types

| Type | Purpose |
|---|---|
| Public Widget Key | Widget communication |
| Private Admin Key | Tenant administration |

---

# 4.2 Widget Authentication

## Header

```http
X-Widget-Key: <public_key>
```

---

## Rules

- Public widget keys are tenant-scoped
- Keys identify tenant ownership
- Keys must be validated on every request

---

# 4.3 Admin Authentication

## Header

```http
Authorization: Bearer <admin_token>
```

---

# 5. Tenant Resolution Contract

# 5.1 Resolution Sources

Tenant resolution may occur through:

- Widget key
- Admin token
- Tenant ID
- Domain mapping

---

# 5.2 Mandatory Validation

Every request must:

- Resolve tenant identity
- Validate tenant ownership
- Reject cross-tenant access

---

# 6. Common API Response Format

# 6.1 Success Response

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

---

# 6.2 Error Response

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid payload"
  }
}
```

---

# 6.3 Meta Object

Optional metadata.

Example:

```json
{
  "meta": {
    "request_id": "req_001",
    "timestamp": "2026-05-21T12:00:00Z"
  }
}
```

---

# 7. Health APIs

# 7.1 Health Check

## Endpoint

```http
GET /health
```

---

## Purpose

Service health validation.

---

## Response

```json
{
  "success": true,
  "data": {
    "status": "healthy"
  }
}
```

---

# 7.2 Readiness Check

## Endpoint

```http
GET /ready
```

---

## Purpose

Checks dependent services.

---

# 8. Chat APIs

# 8.1 Send Chat Message

## Endpoint

```http
POST /chat
```

---

## Purpose

Processes chatbot queries.

---

## Authentication

Widget key required.

---

## Request Schema

```json
{
  "session_id": "session_001",
  "message": "What is your refund policy?",
  "metadata": {
    "page_url": "https://client.com/pricing"
  }
}
```

---

## Field Definitions

| Field | Type | Required |
|---|---|---|
| session_id | string | Yes |
| message | string | Yes |
| metadata | object | No |

---

## Validation Rules

| Field | Validation |
|---|---|
| message | Max 2000 chars |
| session_id | UUID/string |

---

## Internal Flow

```text
Request
   ↓
Tenant Validation
   ↓
RAG Retrieval
   ↓
LLM Runtime
   ↓
Response Generation
```

---

## Success Response

```json
{
  "success": true,
  "data": {
    "response": "Our refund policy allows refunds within 14 days.",
    "sources": [
      "refund_policy.md"
    ]
  }
}
```

---

## Error Response

```json
{
  "success": false,
  "error": {
    "code": "CHAT_PROCESSING_FAILED",
    "message": "Unable to process request"
  }
}
```

---

# 8.2 Future Streaming Chat API

## Planned Endpoint

```http
POST /chat/stream
```

---

## Planned Transport

- Server-Sent Events (SSE)
- WebSockets (future)

---

# 9. Tenant APIs

# 9.1 Create Tenant

## Endpoint

```http
POST /tenant/create
```

---

## Authentication

Admin authentication required.

---

## Request Schema

```json
{
  "name": "Acme Corp",
  "domain": "acme.com"
}
```

---

## Success Response

```json
{
  "success": true,
  "data": {
    "tenant_id": "tenant_001",
    "widget_key": "widget_public_key"
  }
}
```

---

# 9.2 Get Tenant Configuration

## Endpoint

```http
GET /tenant/config
```

---

## Purpose

Fetch tenant chatbot configuration.

---

## Response

```json
{
  "success": true,
  "data": {
    "theme": {
      "primary_color": "#2563eb"
    },
    "limits": {
      "max_tokens": 1000
    }
  }
}
```

---

# 10. Knowledge Upload APIs

# 10.1 Upload Knowledge File

## Endpoint

```http
POST /upload
```

---

## Purpose

Uploads knowledge files for RAG ingestion.

---

## Authentication

Admin authentication required.

---

## Content-Type

```http
multipart/form-data
```

---

## Supported Formats

| Format | Supported |
|---|---|
| .md | Yes |
| .txt | Yes |

---

## Request Fields

| Field | Type | Required |
|---|---|---|
| file | binary | Yes |
| tenant_id | string | Yes |

---

## Validation Rules

| Rule | Value |
|---|---|
| Max File Size | 5MB |
| File Types | md, txt |

---

## Upload Workflow

```text
Upload
   ↓
Validation
   ↓
Temporary Storage
   ↓
N8N Trigger
   ↓
Embedding Pipeline
```

---

## Success Response

```json
{
  "success": true,
  "data": {
    "document_id": "doc_001",
    "status": "processing"
  }
}
```

---

# 10.2 Upload Status API

## Endpoint

```http
GET /upload/status/{document_id}
```

---

## Purpose

Checks ingestion progress.

---

## Response

```json
{
  "success": true,
  "data": {
    "status": "indexed"
  }
}
```

---

# 11. Retrieval APIs

# 11.1 Search Knowledge

## Endpoint

```http
POST /retrieval/search
```

---

## Purpose

Debug/testing retrieval endpoint.

---

## Request Schema

```json
{
  "query": "refund policy"
}
```

---

## Response

```json
{
  "success": true,
  "data": {
    "chunks": [
      {
        "chunk_id": "chunk_001",
        "score": 0.91,
        "content": "Refunds are allowed within 14 days"
      }
    ]
  }
}
```

---

# 12. Widget SDK Contracts

# 12.1 Widget Initialization Contract

## Example

```html
<script>
  ScoutChat.init({
    tenantId: "tenant_001",
    apiKey: "public_widget_key"
  })
</script>
```

---

## Initialization Schema

```json
{
  "tenantId": "tenant_001",
  "apiKey": "public_widget_key"
}
```

---

# 12.2 Widget Runtime Events

## Planned Events

| Event | Purpose |
|---|---|
| onOpen | Widget opened |
| onClose | Widget closed |
| onMessage | Message received |
| onError | Runtime error |

---

# 13. Error Contract Standards

# 13.1 Error Structure

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

---

# 13.2 Standard Error Codes

| Code | Meaning |
|---|---|
| INVALID_REQUEST | Invalid payload |
| UNAUTHORIZED | Invalid authentication |
| TENANT_NOT_FOUND | Invalid tenant |
| FILE_TOO_LARGE | Upload exceeds limit |
| UNSUPPORTED_FILE | Invalid file type |
| CHAT_PROCESSING_FAILED | Chat pipeline failed |
| INTERNAL_SERVER_ERROR | Unexpected failure |

---

# 14. Rate Limiting Contracts

# 14.1 Purpose

Protect infrastructure from abuse.

---

# 14.2 Initial Limits

| API | Limit |
|---|---|
| /chat | 30 req/min |
| /upload | 10 req/hour |

---

# 14.3 Limit Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests"
  }
}
```

---

# 15. Observability Contracts

# 15.1 Request IDs

Every request should include:

```http
X-Request-ID
```

---

# 15.2 Logging Requirements

Every API request should log:

```json
{
  "request_id": "req_001",
  "tenant_id": "tenant_001",
  "endpoint": "/chat",
  "status": 200
}
```

---

# 16. Security API Standards

# 16.1 Input Validation

Every endpoint must validate:

- Required fields
- Field lengths
- File types
- Tenant ownership
- Payload structure

---

# 16.2 Output Sanitization

Responses must:

- Prevent HTML injection
- Avoid leaking internal errors
- Avoid stack traces

---

# 16.3 Cross-Tenant Protection

Every endpoint must:

- Validate tenant ownership
- Enforce metadata filtering
- Reject unauthorized access

---

# 17. Future API Extensions

# Planned APIs

- Streaming APIs
- Analytics APIs
- Dashboard APIs
- Human escalation APIs
- Agent orchestration APIs
- Workflow APIs
- Conversation memory APIs

---

# 18. OpenAPI Standards

# Future Requirement

All APIs should expose:

```text
/openapi.json
/docs
```

---

# 19. Repository Structure

```text
/apps/api
    /routes
    /controllers
    /schemas
    /middleware
    /services
```

---

# 20. Engineering Standards

Every API module must include:

- Request schema
- Response schema
- Validation rules
- Authentication requirements
- Error contracts
- Logging requirements

---

# 21. Final API Philosophy

Scout.io APIs prioritize:

1. Predictability
2. Tenant safety
3. Extensibility
4. Statelessness
5. Strong validation
6. Clear contracts
7. AI-agent readability

The API layer acts as:

- System gateway
- Tenant isolation boundary
- Runtime orchestration layer
- Security enforcement point
- Cross-service communication contract

This architecture ensures:

- Easier scaling
- Lower ambiguity
- Safer integrations
- Better maintainability
- Faster AI-assisted development

