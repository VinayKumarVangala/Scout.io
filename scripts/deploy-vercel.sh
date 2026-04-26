#!/bin/bash

# Scout.io Frontend Deployment Script (Vercel)
# -------------------------------------------

echo "🚀 Initiating Vercel Deployment..."

# 1. Check for Vercel CLI
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI not found. Please install with 'npm i -g vercel'"
    exit 1
fi

# 2. Deploy Frontend
echo "📦 Deploying Dashboard..."
vercel deploy --prod ./packages/frontend --token=$VERCEL_TOKEN --yes

# 3. Deploy Widget (Static)
echo "📦 Deploying Widget Assets..."
vercel deploy --prod ./packages/widget --token=$VERCEL_TOKEN --yes

echo "✅ Deployment Successful!"
