#!/usr/bin/env bash
set -Eeuo pipefail

# ---------- logging from line 1 ----------
LOG_FILE="/tmp/ixora-frontend-deploy.log"
mkdir -p /tmp >/dev/null 2>&1 || true
exec > >(tee -a "$LOG_FILE") 2>&1
echo ""
echo "[$(date -Is)] --- frontend deploy start ---"

# ---------- resolve paths & tools ----------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STACK_DIR="${STACK_DIR:-$SCRIPT_DIR}"                    # default: where this script lives
COMPOSE_FILE="${COMPOSE_FILE:-$STACK_DIR/docker-compose.frontend.yml}"
SERVICE="${SERVICE:-frontend}"
DEFAULT_IMG="${DEFAULT_IMG:-ghcr.io/netinventmalaysia/ixora-frontend:prod}"

DOCKER_BIN="${DOCKER_BIN:-$(command -v docker || true)}"
if [ -z "$DOCKER_BIN" ]; then echo "ERROR: docker not found in PATH"; exit 1; fi

if $DOCKER_BIN compose version >/dev/null 2>&1; then
  COMPOSE_CMD="$DOCKER_BIN compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD="$(command -v docker-compose)"
else
  echo "ERROR: docker compose/docker-compose not found"; exit 1
fi

echo "docker: $DOCKER_BIN"
echo "compose: $COMPOSE_CMD"
echo "compose file: $COMPOSE_FILE"
[ -f "$COMPOSE_FILE" ] || { echo "ERROR: compose file not found"; exit 1; }

# ---------- resolve digest (env / arg / QUERY_STRING) ----------
DIGEST="${DIGEST:-}"
if [ -z "${DIGEST}" ] && [ "${1-}" != "" ]; then DIGEST="$1"; fi
if [ -z "${DIGEST}" ] && [ -n "${QUERY_STRING-}" ]; then
  DIGEST="$(printf '%s' "$QUERY_STRING" | sed -n 's/.*[?&]digest=\([^&]*\).*/\1/p')"
fi
if [ -n "${DIGEST}" ] && ! printf '%s' "$DIGEST" | grep -q '^sha256:'; then
  echo "WARN: invalid digest ('$DIGEST'); ignoring"
  DIGEST=""
fi
echo "DIGEST: ${DIGEST:-<none>} | STACK_DIR: $STACK_DIR"

# If GHCR is private, login here (uncomment and set GHCR_TOKEN env with read:packages)
# echo "$GHCR_TOKEN" | "$DOCKER_BIN" login ghcr.io -u netinventmalaysia --password-stdin || true

# ---------- pull image ----------
if [ -n "$DIGEST" ]; then
  IMAGE_REF="ghcr.io/netinventmalaysia/ixora-frontend@${DIGEST}"
  echo ">>> Pull pinned digest: $IMAGE_REF"
  "$DOCKER_BIN" pull "$IMAGE_REF"
else
  IMAGE_REF="$DEFAULT_IMG"
  echo ">>> Pull tag: $IMAGE_REF"
  "$DOCKER_BIN" pull "$IMAGE_REF"
fi
export IMAGE_REF

# ---------- recreate container ----------
echo ">>> Up -d (force recreate, always pull)"
$COMPOSE_CMD -f "$COMPOSE_FILE" up -d --pull always --no-deps --force-recreate "$SERVICE"

# ---------- diagnostics ----------
CID="$("$DOCKER_BIN" ps -q -f "name=mbmbgo-frontend" || true)"
if [ -n "$CID" ]; then
  RUN_IMG_ID="$("$DOCKER_BIN" inspect --format='{{.Image}}' "$CID")"
  echo "Running container image ID: $RUN_IMG_ID"
  if "$DOCKER_BIN" image inspect "$IMAGE_REF" >/dev/null 2>&1; then
    TAG_DIGEST="$("$DOCKER_BIN" image inspect "$IMAGE_REF" --format='{{index .RepoDigests 0}}' || true)"
    echo "Resolved repo digest:      $TAG_DIGEST"
  fi
else
  echo "WARN: container 'mbmbgo-frontend' not found; check service/container name"
fi

# ---------- cleanup ----------
echo ">>> Prune dangling images"
"$DOCKER_BIN" image prune -f || true

echo "[$(date -Is)] --- frontend deploy done ---"
