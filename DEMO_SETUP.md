# 🎮 Scout.io Demo Setup Guide

This guide provides a comprehensive walkthrough for setting up the Scout.io platform (Server-side) and integrating it into any third-party website (Client-side).

---

## 🛠 I. Server-Side Setup (Scout.io Platform)

This section covers setting up the core infrastructure and backend services that power the AI chat and proxy engine.

### 1. Cloud Infrastructure Configuration
Before running the code, you need to set up your cloud databases and LLM providers.

- **MongoDB Atlas (Database)**:
  - Create a cluster on [MongoDB Atlas](https://www.mongodb.com/).
  - Add your IP to the "Network Access" whitelist.
  - Create a database user and save the connection string.
- **Upstash Redis (Caching & Rate Limiting)**:
  - Create a Redis database on [Upstash](https://upstash.com/).
  - Copy the `REDIS_URL` (starting with `rediss://`).
- **LLM Provider (AI Intelligence)**:
  - Obtain an API key from **OpenAI**, **Anthropic**, or **Google Gemini**.

### 2. Environment Configuration
Create a `.env` file in `packages/backend/` with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb+srv://... (Your Atlas URI)
REDIS_URL=rediss://... (Your Upstash URI)
JWT_SECRET=your-secure-jwt-secret
ENCRYPTION_KEY=your-32-char-encryption-key-1234
OPENAI_API_KEY=your-openai-api-key
```

### 3. Deployment (Render / Railway)
- **Backend**: Deploy the `packages/backend` workspace as a persistent web service.
- **Admin Dashboard**: Deploy `packages/frontend` to **Vercel** as a Next.js application.
- **Build Command**: `npm install && npm run build --workspace=@scout-io/shared && npm run build --workspace=@scout-io/backend`

---

## 🎨 II. Client-Side Setup (Third-Party Website)

This section covers how a client (customer) integrates the Scout.io chatbot into their existing website.

### 1. Client Registration & Verification
Before the widget works, the website domain must be authorized in the Scout.io system.
1. Log in to the **Scout.io Admin Dashboard** (your deployed frontend).
2. Create a new **Client** entry.
3. Add the target website's domain (e.g., `client-site.com`) to the **Whitelisted Domains**.
4. Generate the **Client ID**.

### 2. Widget Snippet Integration
Copy and paste the following snippet into the `<head>` or at the end of the `<body>` of the target website:

```html
<!-- Scout.io Widget Integration -->
<script 
    src="https://your-widget-cdn.com/widget.iife.js" 
    data-client-id="YOUR_GENERATED_CLIENT_ID"
    data-base-url="https://your-api-endpoint.com"
    async>
</script>
```

### 3. Verification Check (Optional)
Scout.io uses a DNS-based or File-based verification for enterprise accounts.
- **DNS**: Add a TXT record `_scout-verification=YOUR_CLIENT_ID` to your domain settings.
- **File**: Host a file at `/.well-known/scout-io.txt` containing your Client ID.

---

## 🧪 III. Running a Local Demo

If you are just testing locally:
1. **Start Backend**: `npm run dev --workspace=@scout-io/backend` (at `http://localhost:5000`)
2. **Start Admin**: `npm run dev --workspace=@scout-io/frontend` (at `http://localhost:3000`)
3. **Register Client**: Use the Admin Dashboard to add `localhost` to the whitelist.
4. **Create Demo Page**: Create an `index.html` file and use the script snippet pointing to `http://localhost:5000`.
5. **Open Demo**: Open the `index.html` in your browser to see the floating chat button.

---

## ⚙️ Platform Summary
| Feature | Server-Side (Scout.io) | Client-Side (Target Website) |
| :--- | :--- | :--- |
| **Hosting** | Render, Vercel, Railway | Any (Webflow, Wix, React, etc.) |
| **Logic** | LLM Orchestration, Proxy Engine | UI Rendering, Event Tracking |
| **Security** | AES-256, JWT, Rate Limiting | Domain Whitelisting, CSRF Protection |
| **Database** | MongoDB, Redis | LocalStorage (Session only) |
