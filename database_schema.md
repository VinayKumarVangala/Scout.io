# DATABASE_SCHEMA.md

# Project Title

Scout.io

> Database architecture and schema specification for the Scout.io multi-tenant AI chatbot platform.

---

# 1. Purpose

This document defines:

- Relational database architecture
- Table schemas
- Entity relationships
- Tenant isolation rules
- Indexing strategy
- Audit structures
- Upload lifecycle persistence
- RAG metadata persistence
- Scalability considerations

The database layer is designed for:

- Multi-tenant safety
- Free-tier sustainability
- Future scalability
- AI-agent-friendly implementation
- Operational observability

---

# 2. Database Philosophy

Scout.io uses a hybrid persistence architecture:

| Data Type | Storage |
|---|---|
| Structured relational data | PostgreSQL |
| Semantic embeddings | Qdrant |
| Raw uploaded files | Cloudflare R2 |

---

# 3. Database Design Principles

## 3.1 Multi-Tenant Isolation

Every tenant-owned entity must contain:

```sql
tenant_id
```

All queries must enforce:

- Tenant scoping
- Ownership validation
- Cross-tenant isolation

---

## 3.2 Auditability

Critical entities should track:

- created_at
- updated_at
- created_by
- status

---

## 3.3 Scalability

The schema must support:

- Future partitioning
- Horizontal scaling
- Read optimization
- Metadata filtering

---

## 3.4 Minimal MVP Complexity

The MVP intentionally avoids:

- Excessive normalization
- Complex distributed transactions
- Premature microservice fragmentation

---

# 4. Database Stack

| Component | Technology |
|---|---|
| Primary DB | PostgreSQL |
| ORM | SQLAlchemy |
| Migration Tool | Alembic |
| Vector DB | Qdrant |
| File Storage | Cloudflare R2 |

---

# 5. High-Level Entity Architecture

```text
Tenant
   │
   ├── API Keys
   ├── Uploads
   ├── Documents
   ├── Chat Sessions
   ├── Chat Messages
   ├── Configurations
   └── Logs
```

---

# 6. Core Relational Entities

# 6.1 tenants

## Purpose

Stores tenant metadata.

---

## Table Schema

```sql
CREATE TABLE tenants (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    domain VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Field Definitions

| Field | Purpose |
|---|---|
| id | Unique tenant identifier |
| slug | Human-readable unique identifier |
| domain | Optional mapped domain |
| status | Tenant lifecycle state |

---

## Indexing

```sql
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_domain ON tenants(domain);
```

---

# 6.2 api_keys

## Purpose

Stores widget and admin API credentials.

---

## Table Schema

```sql
CREATE TABLE api_keys (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    key_hash TEXT NOT NULL,
    key_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);
```

---

## Key Types

| Type | Purpose |
|---|---|
| widget_public | Widget communication |
| admin_private | Administrative actions |

---

## Security Rules

- Keys must be hashed
- Raw keys must never be stored
- Revocation support required

---

## Indexing

```sql
CREATE INDEX idx_api_keys_tenant_id ON api_keys(tenant_id);
CREATE INDEX idx_api_keys_status ON api_keys(status);
```

---

# 6.3 uploads

## Purpose

Tracks uploaded knowledge files.

---

## Table Schema

```sql
CREATE TABLE uploads (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    storage_path TEXT NOT NULL,
    file_size BIGINT,
    upload_status VARCHAR(50) DEFAULT 'uploaded',
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Upload Status Values

| Status | Meaning |
|---|---|
| uploaded | File received |
| processing | Ingestion running |
| indexed | Successfully indexed |
| failed | Processing failed |

---

## Indexing

```sql
CREATE INDEX idx_uploads_tenant_id ON uploads(tenant_id);
CREATE INDEX idx_uploads_status ON uploads(upload_status);
```

---

# 6.4 documents

## Purpose

Represents parsed logical documents.

---

## Table Schema

```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    upload_id UUID REFERENCES uploads(id),
    title VARCHAR(255),
    source_type VARCHAR(50),
    document_status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Purpose Separation

| Table | Responsibility |
|---|---|
| uploads | Physical file tracking |
| documents | Logical parsed content |

---

# 6.5 document_chunks

## Purpose

Tracks chunk metadata for RAG.

NOTE:
Chunk embeddings themselves are stored in Qdrant.

---

## Table Schema

```sql
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    document_id UUID REFERENCES documents(id),
    chunk_index INTEGER,
    qdrant_point_id VARCHAR(255),
    token_count INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Why Store Chunk Metadata Relationally

Benefits:

- Easier auditing
- Faster metadata filtering
- Re-indexing support
- Failure recovery
- Chunk tracking

---

## Indexing

```sql
CREATE INDEX idx_document_chunks_tenant_id ON document_chunks(tenant_id);
CREATE INDEX idx_document_chunks_document_id ON document_chunks(document_id);
```

---

# 6.6 tenant_configs

## Purpose

Stores tenant-specific chatbot configurations.

---

## Table Schema

```sql
CREATE TABLE tenant_configs (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    config JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Example Config

```json
{
  "theme": {
    "primary_color": "#2563eb"
  },
  "limits": {
    "max_tokens": 1000
  },
  "llm": {
    "provider": "openai"
  }
}
```

---

## Why JSONB

Allows:

- Flexible tenant customization
- Future extensibility
- Reduced migration overhead

---

# 6.7 chat_sessions

## Purpose

Tracks anonymous chat sessions.

---

## Table Schema

```sql
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    session_identifier VARCHAR(255),
    started_at TIMESTAMP DEFAULT NOW(),
    last_activity_at TIMESTAMP DEFAULT NOW()
);
```

---

## MVP Philosophy

Anonymous temporary sessions only.

Persistent memory is intentionally deferred.

---

# 6.8 chat_messages

## Purpose

Stores chat interactions.

---

## Table Schema

```sql
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    session_id UUID REFERENCES chat_sessions(id),
    role VARCHAR(50),
    content TEXT,
    token_count INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Roles

| Role | Meaning |
|---|---|
| user | Visitor message |
| assistant | AI response |
| system | Runtime/system messages |

---

## Indexing

```sql
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_tenant_id ON chat_messages(tenant_id);
```

---

# 6.9 ingestion_jobs

## Purpose

Tracks asynchronous ingestion workflows.

---

## Table Schema

```sql
CREATE TABLE ingestion_jobs (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    upload_id UUID REFERENCES uploads(id),
    status VARCHAR(50),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT
);
```

---

## Purpose

Enables:

- Retry workflows
- Failure auditing
- Progress monitoring
- N8N orchestration tracking

---

# 6.10 audit_logs

## Purpose

Stores security and operational audit events.

---

## Table Schema

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    event_type VARCHAR(100),
    event_payload JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Example Events

| Event | Meaning |
|---|---|
| upload_created | File uploaded |
| tenant_created | Tenant onboarded |
| key_revoked | API key revoked |
| auth_failure | Failed authentication |

---

# 7. Qdrant Vector Schema

# 7.1 Purpose

Stores semantic vector embeddings.

---

# 7.2 Collection Strategy

## MVP

Single shared collection.

---

## Tenant Isolation

Enforced via metadata filtering.

---

# 7.3 Vector Payload Schema

```json
{
  "tenant_id": "tenant_001",
  "document_id": "doc_001",
  "chunk_id": "chunk_001",
  "source": "faq.md",
  "chunk_index": 5,
  "content": "Refunds are allowed within 14 days"
}
```

---

# 7.4 Retrieval Rules

Every vector search MUST:

- Filter by tenant_id
- Validate ownership
- Prevent cross-tenant access

---

# 8. Entity Relationship Overview

```text
Tenant
   ├── API Keys
   ├── Uploads
   │      └── Documents
   │             └── Document Chunks
   ├── Chat Sessions
   │      └── Chat Messages
   ├── Configurations
   ├── Audit Logs
   └── Ingestion Jobs
```

---

# 9. Database Migration Strategy

# 9.1 Migration Tool

Alembic

---

# 9.2 Migration Rules

Every migration must:

- Be reversible
- Be versioned
- Avoid destructive operations
- Preserve tenant data

---

# 9.3 Naming Convention

```text
20260521_create_tenants_table.py
```

---

# 10. Indexing Strategy

# 10.1 Core Indexing Goals

Indexes should optimize:

- Tenant filtering
- Upload retrieval
- Session retrieval
- Audit querying
- Chunk tracking

---

# 10.2 Critical Indexed Fields

| Field | Reason |
|---|---|
| tenant_id | Isolation filtering |
| session_id | Chat retrieval |
| upload_status | Workflow tracking |
| created_at | Audit sorting |

---

# 11. Soft Delete Strategy

# MVP Decision

Hard deletes for simplicity.

---

# Future Enhancement

Soft delete support:

```sql
deleted_at TIMESTAMP
```

---

# 12. Data Retention Strategy

# MVP Retention

| Data | Retention |
|---|---|
| Chat logs | Short-term |
| Audit logs | 30 days |
| Uploads | Configurable |

---

# Future Retention

- Tenant-configurable retention
- GDPR-aware deletion
- Export functionality

---

# 13. Backup Strategy

# PostgreSQL

- Daily backups
- Migration snapshots
- Environment separation

---

# Qdrant

- Vector snapshots
- Export capability
- Metadata persistence

---

# 14. Scalability Roadmap

# Phase 1

- Shared PostgreSQL instance
- Shared Qdrant collection
- Basic indexing

---

# Phase 2

- Redis caching
- Read optimization
- Better indexing
- Background workers

---

# Phase 3

- Partitioning
- Per-tenant collections
- Read replicas
- Horizontal scaling

---

# 15. Security Considerations

# Database Rules

Every query must:

- Validate tenant ownership
- Avoid raw SQL injection
- Use parameterized queries
- Enforce scoped retrieval

---

# Sensitive Data Rules

Never store:

- Raw passwords
- Raw API keys
- Plaintext secrets

---

# 16. ORM Architecture

# ORM Choice

SQLAlchemy

---

# Benefits

- Type-safe models
- Migration support
- Relationship handling
- Query abstraction

---

# Example Model Structure

```text
/apps/api
    /models
        tenant.py
        upload.py
        document.py
```

---

# 17. Observability & Analytics

# Metrics to Track

| Metric | Purpose |
|---|---|
| Upload count | Usage |
| Chunk count | Storage |
| Retrieval count | RAG activity |
| Failed jobs | Reliability |

---

# 18. Future Database Enhancements

# Planned Features

- RBAC tables
- User authentication tables
- Conversation memory
- Agent workflows
- Semantic caching
- Usage billing
- Analytics dashboards

---

# 19. Engineering Standards

Every schema module must define:

- Purpose
- Relationships
- Indexes
- Constraints
- Security implications
- Migration behavior

---

# 20. Final Database Philosophy

Scout.io's database architecture prioritizes:

1. Tenant isolation
2. Operational simplicity
3. Observability
4. Free-tier sustainability
5. Modular scalability
6. AI-agent readability
7. Future extensibility

The persistence architecture intentionally separates:

- Relational data
- Vector embeddings
- Raw file storage

This separation improves:

- Performance
- Scalability
- Maintainability
- Security
- Retrieval efficiency

The database layer acts as:

- The operational memory of the platform
- The tenant isolation backbone
- The workflow persistence engine
- The audit and observability foundation

