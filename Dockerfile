FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Builder stage
FROM base AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npx prisma generate
RUN npm run build

# Runner stage
FROM base AS runner
WORKDIR /app
RUN apk add --no-cache openssl

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/start.sh ./start.sh
RUN mkdir -p ./public && sed -i 's/\r//' ./start.sh && chmod +x ./start.sh

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["sh", "./start.sh"]
