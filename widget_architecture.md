# WIDGET_ARCHITECTURE.md

# Project Title

Scout.io

> Frontend widget architecture specification for the Scout.io embeddable multi-tenant AI chatbot platform.

---

# 1. Purpose

This document defines:

- Widget runtime architecture
- Embedding strategy
- SDK initialization
- UI lifecycle
- Communication contracts
- Frontend isolation
- Session handling
- Security protections
- Performance strategy
- Extensibility roadmap

The widget acts as:

- The public interaction layer
- The embeddable client runtime
- The communication bridge to Scout.io APIs
- The tenant-specific chatbot interface

---

# 2. Widget Philosophy

The Scout.io widget must be:

- Lightweight
- Embeddable
- Framework-agnostic
- Secure
- Themeable
- Responsive
- Tenant-aware
- Low-latency
- Non-invasive to host websites

---

# 3. Widget Goals

## Primary Goals

- Simple installation
- Minimal integration effort
- Strong UI isolation
- Fast loading
- Stable communication
- Mobile responsiveness

---

## Secondary Goals

- Streaming support
- Extensible plugins
- Accessibility support
- Future voice integration
- Multi-theme support

---

# 4. High-Level Widget Architecture

```text
Host Website
     │
     ▼
Embedded Scout Script
     │
     ▼
Widget Runtime Loader
     │
     ▼
Shadow DOM Container
     │
     ▼
Widget UI Runtime
     │
     ▼
Scout.io APIs
```

---

# 5. Embedding Strategy

# 5.1 MVP Integration Method

Script-based embedding.

---

## Example Integration

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

# 5.2 Why Script Embedding

Benefits:

- Easy integration
- Framework-independent
- Universal compatibility
- CDN-deliverable
- Minimal setup

---

# 5.3 Future Embedding Options

| Method | Planned |
|---|---|
| React SDK | Yes |
| Vue SDK | Yes |
| iframe Embed | Yes |
| NPM Package | Yes |

---

# 6. Widget Loader Architecture

# 6.1 Purpose

Loads the widget runtime dynamically.

---

# 6.2 Responsibilities

- Fetch configuration
- Initialize runtime
- Create isolated container
- Attach widget UI
- Start API communication

---

# 6.3 Runtime Flow

```text
Widget Script Loaded
      ↓
Validate Configuration
      ↓
Resolve Tenant
      ↓
Create Shadow DOM
      ↓
Load Widget Runtime
      ↓
Initialize Session
```

---

# 7. Shadow DOM Isolation

# 7.1 Purpose

Prevents CSS and DOM conflicts.

---

# 7.2 Isolation Goals

Protect against:

- Host CSS collisions
- DOM pollution
- Script interference
- Styling corruption

---

# 7.3 Isolation Rules

The widget must:

- Use Shadow DOM
- Scope styles internally
- Avoid modifying host DOM
- Avoid global CSS leakage

---

# 7.4 Example Structure

```text
<body>
   ├── Host Website
   └── <scout-widget-root>
            └── Shadow DOM
                    └── Widget UI
```

---

# 8. Widget Runtime Architecture

# 8.1 Core Runtime Modules

| Module | Responsibility |
|---|---|
| Loader | Bootstrap widget |
| Session Manager | Session lifecycle |
| API Client | Backend communication |
| UI Renderer | Chat rendering |
| Event System | Widget events |
| Theme Manager | Styling |
| Error Handler | Runtime failures |

---

# 8.2 Runtime Principles

The runtime should:

- Remain modular
- Support lazy loading
- Minimize blocking operations
- Avoid memory leaks

---

# 9. Session Architecture

# 9.1 MVP Session Model

Anonymous temporary sessions.

---

# 9.2 Session Generation

Session IDs generated on widget initialization.

---

# 9.3 Session Storage

## MVP

Browser localStorage.

---

## Example

```javascript
localStorage.setItem('scout_session_id', sessionId)
```

---

# 9.4 Future Enhancements

- Authenticated sessions
- Persistent memory
- Multi-device synchronization

---

# 10. Widget UI Architecture

# 10.1 UI Components

| Component | Purpose |
|---|---|
| Launcher Button | Opens widget |
| Chat Window | Main interface |
| Message List | Conversation rendering |
| Input Box | User input |
| Loading State | Response progress |
| Error State | Failure display |

---

# 10.2 Rendering Strategy

## MVP

Client-side rendering.

---

## Future

- Streaming rendering
- Virtualized messages
- Incremental updates

---

# 11. API Communication Architecture

# 11.1 Communication Flow

```text
User Message
      ↓
Widget Runtime
      ↓
API Client
      ↓
Scout.io Backend
      ↓
LLM Runtime
      ↓
Widget Response Rendering
```

---

# 11.2 Transport Protocol

## MVP

HTTPS REST APIs.

---

## Future

- SSE streaming
- WebSocket support

---

# 11.3 Chat Request Example

```json
{
  "session_id": "session_001",
  "message": "What are your business hours?"
}
```

---

# 12. Widget Event System

# 12.1 Purpose

Allows host applications to react to widget activity.

---

# 12.2 MVP Events

| Event | Purpose |
|---|---|
| onOpen | Widget opened |
| onClose | Widget closed |
| onMessage | Message sent |
| onError | Runtime error |

---

# 12.3 Example Event Usage

```javascript
ScoutChat.on('onOpen', () => {
  console.log('Widget opened')
})
```

---

# 13. Theming Architecture

# 13.1 Purpose

Allows tenant branding customization.

---

# 13.2 Theme Sources

Themes may come from:

- Tenant configuration API
- Inline widget config
- Default Scout theme

---

# 13.3 Theme Config Example

```json
{
  "theme": {
    "primary_color": "#2563eb",
    "border_radius": "16px"
  }
}
```

---

# 13.4 Styling Rules

Widget styles must:

- Remain scoped
- Avoid global collisions
- Support dark mode
- Support mobile layouts

---

# 14. Performance Strategy

# 14.1 Performance Goals

| Concern | Target |
|---|---|
| Widget bootstrap | < 2 seconds |
| API latency | < 5 seconds |
| Bundle size | Minimal |

---

# 14.2 Optimization Strategies

## MVP

- Minified bundles
- Lazy initialization
- Lightweight dependencies

---

## Future

- Code splitting
- Edge delivery
- Streaming rendering
- Asset prefetching

---

# 15. Error Handling Architecture

# 15.1 Error Categories

| Error | Example |
|---|---|
| Network Error | API unavailable |
| Runtime Error | JS exception |
| Auth Error | Invalid widget key |
| Timeout Error | Slow responses |

---

# 15.2 Error UX Rules

The widget should:

- Fail gracefully
- Avoid breaking host page
- Display user-friendly errors
- Retry recoverable failures

---

# 15.3 Example User Message

```text
The assistant is temporarily unavailable.
Please try again later.
```

---

# 16. Security Architecture

# 16.1 Frontend Security Goals

Protect against:

- XSS
- DOM injection
- Script conflicts
- Token leakage

---

# 16.2 Security Rules

The widget must:

- Sanitize rendered content
- Avoid eval()
- Avoid inline script execution
- Restrict dangerous HTML

---

# 16.3 API Key Handling

Public widget keys:

- Must remain tenant-scoped
- Must never expose admin privileges
- Should be revocable

---

# 17. Accessibility Standards

# 17.1 Accessibility Goals

The widget should support:

- Keyboard navigation
- Screen readers
- Focus management
- High contrast themes

---

# 17.2 Planned Standards

WCAG-inspired accessibility practices.

---

# 18. Mobile Responsiveness

# 18.1 Mobile Goals

The widget should:

- Fit small screens
- Avoid viewport overflow
- Support touch interactions
- Maintain readable typography

---

# 18.2 Mobile Modes

| Device | Layout |
|---|---|
| Desktop | Floating widget |
| Mobile | Full-screen modal |

---

# 19. CDN Delivery Architecture

# 19.1 Delivery Strategy

The widget bundle should be served via CDN.

---

# 19.2 Benefits

- Faster loading
- Global distribution
- Lower origin load
- Cache optimization

---

# 19.3 MVP Recommendation

Cloudflare CDN.

---

# 20. Build Architecture

# 20.1 Recommended Stack

| Layer | Technology |
|---|---|
| Framework | React |
| Bundler | Vite |
| Styling | TailwindCSS |
| State | Zustand |

---

# 20.2 Bundle Goals

The widget should:

- Minimize dependencies
- Avoid heavy runtime libraries
- Optimize bundle size

---

# 21. Widget Repository Structure

```text
/apps/widget
    /src
        /components
        /runtime
        /events
        /styles
        /hooks
        /api
```

---

# 22. Future Widget Enhancements

# Planned Features

- Voice assistant mode
- File upload support
- Streaming tokens
- Typing indicators
- Multi-language support
- Human escalation
- AI workflow triggers
- Plugin ecosystem

---

# 23. Widget Lifecycle Model

# 23.1 Lifecycle Flow

```text
Initialize
    ↓
Authenticate
    ↓
Resolve Tenant
    ↓
Create Session
    ↓
Render UI
    ↓
Start Messaging
    ↓
Cleanup
```

---

# 23.2 Cleanup Responsibilities

The widget should:

- Remove listeners
- Clear timers
- Release memory
- Prevent leaks

---

# 24. Observability Architecture

# 24.1 Metrics to Track

| Metric | Purpose |
|---|---|
| Widget loads | Usage |
| Session starts | Engagement |
| Errors | Reliability |
| API latency | Performance |

---

# 24.2 Error Reporting

Future integration:

- Sentry
- PostHog
- Internal telemetry APIs

---

# 25. Engineering Standards

Every widget module must define:

- Purpose
- Inputs/outputs
- Failure behavior
- Security implications
- Cleanup behavior

---

# 26. Final Widget Philosophy

Scout.io's widget architecture prioritizes:

1. Easy integration
2. Strong isolation
3. Lightweight runtime
4. Tenant-aware behavior
5. Secure communication
6. Performance optimization
7. Extensibility

The widget is intentionally designed as:

- A portable AI runtime
- A framework-agnostic communication layer
- A secure browser-side interface
- A scalable customer interaction gateway

The architecture separates:

- Loader logic
- UI runtime
- API communication
- Session handling
- Theme management
- Event orchestration

This separation improves:

- Maintainability
- Security
- Scalability
- Developer exp