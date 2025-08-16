#!/usr/bin/env bash
set -euo pipefail
STACK_DIR="/www/wwwroot/ixora/frontend"
LOG_FILE="/tmp/ixora-frontend-deploy.log"
COMPOSE_FILE="$STACK_DIR/docker-compose.frontend.yml"
IMG="ghcr.io/netinventmalaysia/ixora-frontend:prod"

echo "[$(date -Is)] --- frontend deploy start ---" | tee -a "$LOG_FILE"
cd "$STACK_DIR"

# Pull latest image & recreate
echo ">>> Pull $IMG" | tee -a "$LOG_FILE"
docker compose -f "$COMPOSE_FILE" pull || true

echo ">>> Up -d" | tee -a "$LOG_FILE"
docker compose -f "$COMPOSE_FILE" up -d

echo ">>> Prune old images" | tee -a "$LOG_FILE"
docker image prune -f || true

echo "[$(date -Is)] --- frontend deploy done ---" | tee -a "$LOG_FILE"
