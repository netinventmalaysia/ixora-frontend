#!/usr/bin/env bash
set -euo pipefail

STACK_DIR="/www/wwwroot/ixora/frontend"
LOG_FILE="/tmp/ixora-frontend-deploy.log"
COMPOSE_FILE="$STACK_DIR/docker-compose.frontend.yml"
SERVICE="frontend"
DEFAULT_IMG="ghcr.io/netinventmalaysia/ixora-frontend:prod"

echo "[$(date -Is)] --- frontend deploy start ---" | tee -a "$LOG_FILE"
cd "$STACK_DIR"

# Resolve DIGEST from env, CLI arg, or QUERY_STRING (?digest=sha256:...)
DIGEST="${DIGEST:-}"
if [ -z "${DIGEST}" ] && [ "${1-}" != "" ]; then DIGEST="$1"; fi
if [ -z "${DIGEST}" ] && [ -n "${QUERY_STRING-}" ]; then
  DIGEST="$(printf '%s' "$QUERY_STRING" | sed -n 's/.*[?&]digest=\([^&]*\).*/\1/p')"
fi
if [ -n "${DIGEST}" ] && ! printf '%s' "$DIGEST" | grep -q '^sha256:'; then
  echo "WARN: invalid digest format ('$DIGEST'), ignoring" | tee -a "$LOG_FILE"
  DIGEST=""
fi

# If GHCR package is private, uncomment and provide PAT with read:packages
# echo "$GHCR_TOKEN" | docker login ghcr.io -u netinventmalaysia --password-stdin || true

if [ -n "${DIGEST}" ]; then
  IMAGE_REF="ghcr.io/netinventmalaysia/ixora-frontend@${DIGEST}"
  echo ">>> Pinning to digest: ${IMAGE_REF}" | tee -a "$LOG_FILE"
  docker pull "$IMAGE_REF" | tee -a "$LOG_FILE"
else
  IMAGE_REF="$DEFAULT_IMG"
  echo ">>> No digest provided; using tag: ${IMAGE_REF}" | tee -a "$LOG_FILE"
  docker pull "$IMAGE_REF" | tee -a "$LOG_FILE"
fi

export IMAGE_REF

echo ">>> Recreate container with newest image" | tee -a "$LOG_FILE"
docker compose -f "$COMPOSE_FILE" up -d --pull always --no-deps --force-recreate "$SERVICE"

# Diagnostics
CID="$(docker ps -q -f "name=mbmbgo-frontend" || true)"
if [ -n "$CID" ]; then
  RUN_IMG_ID="$(docker inspect --format='{{.Image}}' "$CID")"
  echo "Running container image ID: $RUN_IMG_ID" | tee -a "$LOG_FILE"
  # Show the repo digest we resolved
  if docker image inspect "$IMAGE_REF" >/dev/null 2>&1; then
    TAG_DIGEST="$(docker image inspect "$IMAGE_REF" --format='{{index .RepoDigests 0}}' || true)"
    echo "Resolved repo digest:      $TAG_DIGEST" | tee -a "$LOG_FILE"
  fi
fi

echo ">>> Prune dangling images" | tee -a "$LOG_FILE"
docker image prune -f || true

echo "[$(date -Is)] --- frontend deploy done ---" | tee -a "$LOG_FILE"
