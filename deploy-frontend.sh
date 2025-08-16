#!/usr/bin/env bash
set -euo pipefail
STACK_DIR="/www/wwwroot/ixora/frontend"
LOG_FILE="/tmp/ixora-frontend-deploy.log"
COMPOSE_FILE="$STACK_DIR/docker-compose.frontend.yml"
SERVICE="frontend"
IMG="ghcr.io/netinventmalaysia/ixora-frontend:prod"

echo "[$(date -Is)] --- frontend deploy start ---" | tee -a "$LOG_FILE"
cd "$STACK_DIR"

# (1) If your GHCR image is private, make sure the server is logged in:
# echo "$GHCR_TOKEN" | docker login ghcr.io -u netinventmalaysia --password-stdin || true

echo ">>> Pull latest $IMG" | tee -a "$LOG_FILE"
docker compose -f "$COMPOSE_FILE" pull "$SERVICE" || true

echo ">>> Recreate container with the newest image" | tee -a "$LOG_FILE"
docker compose -f "$COMPOSE_FILE" up -d --pull always --no-deps --force-recreate "$SERVICE"

echo ">>> Show running image digest (container + tag)" | tee -a "$LOG_FILE"
CID=$(docker ps -q -f "name=mbmbgo-frontend" || true)
if [ -n "${CID:-}" ]; then
  RUNDIGEST=$(docker inspect --format='{{.Image}}' "$CID")
  TAGDIGEST=$(docker image inspect "$IMG" --format='{{index .RepoDigests 0}}' || true)
  echo "Container image ID: $RUNDIGEST" | tee -a "$LOG_FILE"
  echo "Tag digest:        $TAGDIGEST"   | tee -a "$LOG_FILE"
fi

echo ">>> Prune dangling images" | tee -a "$LOG_FILE"
docker image prune -f || true

echo "[$(date -Is)] --- frontend deploy done ---" | tee -a "$LOG_FILE"
