# 🎮 Scout.io Demo Setup Guide

Follow this guide to set up a complete local or cloud-based demo of the Scout.io platform, from backend orchestration to widget integration on a third-party site.

---

## 1️⃣ Local Development Setup

### Prerequisites
- **Node.js**: v20 or higher.
- **Docker**: (Optional, for local DB/Redis) or cloud accounts (Atlas/Upstash).

### Steps
1. **Clone & Install**:
   ```bash
   git clone https://github.com/VinayKumarVangala/Scout.io.git
   cd Scout.io
   npm install
   ```

2. **Configure Environment**:
   Copy `.env.example` to `packages/backend/.env` and fill in the following:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/scout
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=demo-secret-key
   ENCRYPTION_KEY=12345678901234567890123456789012 # Must be 32 chars
   ```

3. **Start Services**:
   - **Database & Redis**: Run via Docker: `docker-compose up -d mongodb redis`
   - **Backend**: `npm run dev --workspace=@scout-io/backend`
   - **Frontend (Admin)**: `npm run dev --workspace=@scout-io/frontend`

---

## 2️⃣ Creating Your First Client (Tenant)

1. Open the **Admin Dashboard** at `http://localhost:3000`.
2. Go to the **Clients** tab and click **Add New Client**.
3. **General**: Name it "Demo Client".
4. **Domains**: Add `localhost` and `127.0.0.1`.
5. **LLM Config**: Choose `OpenAI` (ensure your API key is in the backend `.env`).
6. **Save**: Note the generated **Client ID**.

---

## 3️⃣ Widget Integration Demo

To simulate integrating Scout.io into another website:

1. **Create a Demo HTML File**:
   Create a file named `demo.html` in your root directory:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <title>My Awesome Website</title>
   </head>
   <body>
       <h1>Welcome to the Future!</h1>
       <p>This is a third-party website with Scout.io integrated.</p>

       <!-- Scout.io Widget -->
       <script 
           src="http://localhost:5000/widget.iife.js" 
           data-client-id="REPLACE_WITH_YOUR_CLIENT_ID"
           data-base-url="http://localhost:5000"
           async>
       </script>
   </body>
   </html>
   ```

2. **Build the Widget**:
   ```bash
   npm run build --workspace=@scout-io/widget
   ```
   *Note: Ensure the backend is serving the `dist` folder of the widget or use the absolute path.*

3. **Open the Demo**:
   Open `demo.html` in your browser. You should see the floating chat button in the bottom right!

---

## 4️⃣ Advanced: Cloud Demo

If you want to demo the "Elite Architecture" (CDN + Cloud Backend):

1. **Backend**: Deploy `packages/backend` to **Render** (Follow `DEPLOYMENT.md`).
2. **Widget**: Deploy `packages/widget/dist` to **Vercel** as a static site.
3. **Admin**: Deploy `packages/frontend` to **Vercel**.
4. **Integration**: Update the `src` and `data-base-url` in your `demo.html` to point to the live cloud URLs.

---

## 🧪 Testing the Proxy Engine
In the chat interface, try asking:
> "Check the weather in London"

The system will trigger the built-in `get_weather` tool, demonstrating the secure proxy engine's capability to execute functions on behalf of the AI.
