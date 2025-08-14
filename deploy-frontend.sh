#!/usr/bin/env bash
set -euo pipefail

STACK_DIR="/www/wwwroot/ixora/frontend"
COMPOSE_FILE="$STACK_DIR/docker-compose.frontend.yml"   # <- name it like this (or adjust)
LOG_FILE="/tmp/ixora-frontend-deploy.log"
IMG="ghcr.io/netinventmalaysia/ixora-frontend:prod"     # <- your GHCR image tag

echo "[$(date -Is)] --- frontend deploy start ---" | tee -a "$LOG_FILE"
cd "$STACK_DIR"

# 0) sanity
[ -f "$COMPOSE_FILE" ] || { echo "Compose not found: $COMPOSE_FILE" | tee -a "$LOG_FILE"; exit 1; }

# 1) Git sync (only if this folder is a git checkout)
if [ -d ".git" ]; then
  echo ">>> Git sync (origin/main)" | tee -a "$LOG_FILE"
  BEFORE_SHA=$(git rev-parse HEAD 2>/dev/null || echo "none")
  echo ">>> Git before: ${BEFORE_SHA}" | tee -a "$LOG_FILE"
  git clean -fd
  git fetch --all --prune
  git reset --hard origin/main
  AFTER_SHA=$(git rev-parse HEAD || echo "unknown")
  echo ">>> Git after:  ${AFTER_SHA}" | tee -a "$LOG_FILE"
else
  echo ">>> No .git directory; skipping git sync" | tee -a "$LOG_FILE"
fi

# 2) Pull image (logs digest + revision label)
echo ">>> Pull latest image $IMG" | tee -a "$LOG_FILE"
docker pull "$IMG" >/dev/null || true
DIGEST=$(docker inspect -f '{{index .RepoDigests 0}}' "$IMG" || true)
REV=$(docker inspect -f '{{ index .Config.Labels "org.opencontainers.image.revision" }}' "$IMG" || true)
echo ">>> Image: ${DIGEST}" | tee -a "$LOG_FILE"
echo ">>> Image revision label: ${REV}" | tee -a "$LOG_FILE"

# 3) Recreate containers
echo ">>> Recreate containers" | tee -a "$LOG_FILE"
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

# 4) Optional: wait for container to answer on port (adjust port if needed)
# FRONT_PORT=3001
# for i in {1..30}; do
#   if curl -fsS http://127.0.0.1:${FRONT_PORT}/ >/dev/null 2>&1; then
#     echo ">>> Frontend is responding on ${FRONT_PORT}" | tee -a "$LOG_FILE"; break
#   fi
#   sleep 1
#   [ $i -eq 30 ] && echo ">>> Frontend not responding yet" | tee -a "$LOG_FILE"
# done

# 5) Cleanup old images
echo ">>> Cleanup old images" | tee -a "$LOG_FILE"
docker image prune -f >/dev/null 2>&1 || true

echo "[$(date -Is)] --- frontend deploy done ---" | tee -a "$LOG_FILE"
