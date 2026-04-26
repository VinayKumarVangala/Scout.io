#!/bin/bash

# Scout.io Backend Deployment Script (Render)
# ------------------------------------------

echo "🚀 Initiating Render Deployment..."

# 1. Trigger Deploy Webhook
# Render usually deploys via Git, but we can trigger a manual deploy via webhook
if [ -z "$RENDER_DEPLOY_HOOK" ]; then
    echo "❌ RENDER_DEPLOY_HOOK not set. Skipping webhook trigger."
else
    curl -X POST "$RENDER_DEPLOY_HOOK"
    echo "📡 Deploy trigger sent to Render."
fi

# 2. Run Database Migrations (Optional/Context Dependent)
# npm run migrate --workspace=@scout-io/backend

echo "✅ Deployment Process Started!"
