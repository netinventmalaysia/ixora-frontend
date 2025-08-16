#!/usr/bin/env bash
set -euo pipefail

STACK_DIR="/www/wwwroot/ixora/frontend"
LOG_FILE="/tmp/ixora-frontend-deploy.log"
IMG="ghcr.io/netinventmalaysia/ixora-frontend:prod"

# Auto-detect compose file
COMPOSE_FILE=""
for f in docker-compose.frontend.yml docker-compose.yaml docker-compose.yml; do
  [ -f "$STACK_DIR/$f" ] && COMPOSE_FILE="$STACK_DIR/$f" && break
done
if [ -z "${COMPOSE_FILE:-}" ]; then
  echo "Compose not found in $STACK_DIR" | tee -a "$LOG_FILE"
  exit 1
fi

echo "[$(date -Is)] --- frontend deploy start ---" | tee -a "$LOG_FILE"

cd "$STACK_DIR"
# ensure perms & safe dir
sudo chown -R jtm:jtm "$STACK_DIR" || true
git config --global --add safe.directory "$STACK_DIR" || true

# Optional: sync code if you build locally from Dockerfile
# git fetch --all --prune || true
# git reset --hard origin/main || true
# git clean -fd || true

echo ">>> Pull latest image $IMG" | tee -a "$LOG_FILE"
docker compose -f "$COMPOSE_FILE" pull || true

echo ">>> Recreate containers" | tee -a "$LOG_FILE"
docker compose -f "$COMPOSE_FILE" up -d

echo ">>> Cleanup old images" | tee -a "$LOG_FILE"
docker image prune -f || true

echo "[$(date -Is)] --- frontend deploy done ---" | tee -a "$LOG_FILE"
echo "Frontend deployment completed successfully." | tee -a "$LOG_FILE"