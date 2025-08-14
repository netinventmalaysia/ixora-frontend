# ---------- Builder ----------
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat

# install deps first for caching
COPY package*.json ./
RUN npm ci

# copy source
COPY . .

# Ensure the Next bin is executable (and strip CRLF if present)
# (dos2unix is tiny; you can remove it later if you like)
RUN apk add --no-cache dos2unix \
  && chmod -R +x node_modules/.bin \
  && dos2unix node_modules/.bin/next || true

# build
RUN npm run build