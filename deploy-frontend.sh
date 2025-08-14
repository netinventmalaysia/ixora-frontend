#!/usr/bin/env bash
set -euo pipefail

STACK_DIR="/www/wwwroot/ixora/frontend"
COMPOSE_FILE="$STACK_DIR/docker-compose.frontend.yml"

cd "$STACK_DIR"

[ -f "$COMPOSE_FILE" ] || { echo "Compose not found"; exit 1; }

echo ">>> Pull latest image"
docker compose -f "$COMPOSE_FILE" pull

echo ">>> Recreate containers"
docker compose -f "$COMPOSE_FILE" up -d

echo ">>> Cleanup old images"
docker image prune -f

echo ">>> Done"

