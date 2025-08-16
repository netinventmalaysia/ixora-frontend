# ---------- Build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Improve npm performance & smaller images
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Some native deps need this on Alpine
RUN apk add --no-cache libc6-compat

# Install deps first (better cache)
COPY package.json package-lock.json* ./
# If you use pnpm/yarn, replace with the right install cmd
RUN if [ -f package-lock.json ]; then npm ci --omit=dev=false; else npm install; fi

# Copy source
COPY . .

# accept build-time envs for Next.js
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BUILD_SHA
ARG NEXT_PUBLIC_BUILD_TIME
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_BUILD_SHA=$NEXT_PUBLIC_BUILD_SHA \
    NEXT_PUBLIC_BUILD_TIME=$NEXT_PUBLIC_BUILD_TIME

# Build (outputs .next)
RUN npm run build

# ---------- Runtime stage ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3001

# Copy only what we need for runtime
# If your Next.js is configured for "standalone" output, prefer that (smaller):
#   In next.config.js: output: 'standalone'
# Then these copies are enough:
#   COPY --from=builder /app/.next/standalone ./
#   COPY --from=builder /app/.next/static ./.next/static
#   COPY --from=builder /app/public ./public
# Otherwise, fall back to copying node_modules + build output:
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Expose internal port used by the app
EXPOSE 3001

# If your start script is "next start", this works:
CMD ["npx", "next", "start", "-p", "3001"]
