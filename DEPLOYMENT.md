# 🚀 Scout.io Deployment Guide

This guide provides step-by-step instructions for deploying the Scout.io platform to production using our **Hybrid Elite Architecture**.

---

## 1️⃣ External Services Setup

### MongoDB Atlas (Database)
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. **Network Access**: Add `0.0.0.0/0` (for initial setup) or specific IPs from Render/Railway.
3. **Database Access**: Create a user with `readWriteAnyDatabase` permissions.
4. Copy the connection string: `mongodb+srv://<user>:<password>@cluster.mongodb.net/scout`.

### Upstash Redis (Cache)
1. Create a database on [Upstash](https://upstash.com/).
2. Enable **TLS**.
3. Copy the `REDIS_URL`: `rediss://default:<password>@<host>:<port>`.

---

## 2️⃣ Backend Deployment (Render / Railway)

### Using Render
1. Create a new **Web Service**.
2. Connect the GitHub repository.
3. Set **Root Directory** to `packages/backend`.
4. Set **Build Command**: `npm install && npm run build --workspace=@scout-io/shared && npm run build --workspace=@scout-io/backend`.
5. Set **Start Command**: `node packages/backend/dist/server.js`.
6. Add **Environment Variables**:
   - `MONGODB_URI`: (From Atlas)
   - `REDIS_URL`: (From Upstash)
   - `JWT_SECRET`: (Random string)
   - `ENCRYPTION_KEY`: (32 character random string)

---

## 3️⃣ Frontend & Widget Deployment (Vercel)

1. Create a new project on [Vercel](https://vercel.com).
2. Connect the GitHub repository.
3. **Framework Preset**: Next.js.
4. Set **Root Directory** to `packages/frontend`.
5. Add **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: (Your backend URL from Render)
6. For the **Widget**, create a separate project or use a subdirectory build in Vercel pointing to `packages/widget`.

---

## 4️⃣ DNS & Domain Configuration

### Widget Integration
Add this snippet to the target website:
```html
<script 
  src="https://your-widget-url.vercel.app/widget.iife.js" 
  data-client-id="YOUR_CLIENT_ID" 
  data-base-url="https://your-backend-url.render.com"
  async>
</script>
```

### Domain Verification
1. Add your custom domain in the **Client Dashboard**.
2. Create a `TXT` record at `_scout-verification.yourdomain.com` with the value provided in the dashboard.
3. Click **Verify** to enable the widget for that domain.

---

## 5️⃣ Launch Verification
1. [ ] Check `/health` endpoint on backend.
2. [ ] Verify `/docs` is accessible.
3. [ ] Test chat completion from the Admin Playground.
4. [ ] Verify messages are being stored in MongoDB.
5. [ ] Check Redis for active sessions.

---

## 🚨 Troubleshooting
- **CORS Errors**: Ensure the frontend domain is added to the Client's `domains` list in the database.
- **WebSocket Fails**: Verify your hosting provider supports WebSockets (Render/Railway do).
- **Encryption Errors**: Ensure `ENCRYPTION_KEY` is exactly 32 characters.
