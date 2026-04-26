# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared packages/shared
COPY packages/frontend packages/frontend

RUN npm install

RUN npm run build --workspace=@scout-io/shared
RUN npm run build --workspace=@scout-io/frontend

# Production Stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/packages/frontend/public ./public
COPY --from=builder /app/packages/frontend/.next/standalone ./
COPY --from=builder /app/packages/frontend/.next/static ./.next/static

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

USER node

CMD ["node", "server.js"]
