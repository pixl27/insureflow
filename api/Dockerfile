# Base Node image
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app

COPY package*.json ./
COPY api/crm/package.json ./api/crm/
# Add other services as needed
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/

RUN npm ci --legacy-peer-deps

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate --schema=packages/database/prisma/schema.prisma

# Build the specific service (passed as build-arg)
ARG SERVICE_NAME=crm
RUN npm run build --workspace=@insureflow/api-${SERVICE_NAME}

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

ARG SERVICE_NAME=crm
ENV SERVICE=${SERVICE_NAME}

RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/api/${SERVICE}/dist ./api/${SERVICE}/dist
COPY --from=builder /app/api/${SERVICE}/package.json ./api/${SERVICE}/package.json
COPY --from=builder /app/packages/database/dist ./packages/database/dist

USER nestjs

CMD ["node", "api/${SERVICE}/dist/main.js"]
