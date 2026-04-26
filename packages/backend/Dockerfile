# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root configs
COPY package.json package-lock.json ./
COPY packages/shared packages/shared
COPY packages/backend packages/backend

# Install dependencies
RUN npm install

# Build shared and backend
RUN npm run build --workspace=@scout-io/shared
RUN npm run build --workspace=@scout-io/backend

# Production Stage
FROM node:20-alpine

WORKDIR /app

# Copy built files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /app/packages/backend/package.json ./packages/backend/package.json

# Environment
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Non-root user
USER node

CMD ["node", "packages/backend/dist/server.js"]
