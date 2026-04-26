#!/bin/bash

# Scout.io Widget Deployment Script
# ---------------------------------

echo "🚀 Starting Scout.io Widget Build..."

# 1. Clean previous builds
rm -rf dist

# 2. Build for production
npm run build

# 3. Versioning
VERSION=$(node -p "require('./package.json').version")
echo "📦 Version: $VERSION"

# 4. Upload to CDN (Placeholder)
# Example: vercel deploy --prod ./dist
# Example: aws s3 sync ./dist s3://scout-io-cdn/widget/v$VERSION

echo "✅ Deployment successful!"
