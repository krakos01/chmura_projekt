#!/usr/bin/env bash
# Build FishNet Docker images inside the Minikube Docker daemon.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="${BACKEND_DIR:-$ROOT_DIR/backend}"
FRONTEND_DIR="${FRONTEND_DIR:-$ROOT_DIR/frontend}"

if ! command -v minikube >/dev/null 2>&1; then
  echo "Error: minikube is not installed or not in PATH." >&2
  exit 1
fi

echo "==> Pointing Docker CLI at the Minikube daemon"
eval "$(minikube docker-env)"

if [[ ! -d "$FRONTEND_DIR" ]]; then
  echo "Error: Frontend directory not found at: $FRONTEND_DIR" >&2
  exit 1
fi

echo "==> Building frontend image: fishing-forum-frontend:latest"
docker build -t fishing-forum-frontend:latest "$FRONTEND_DIR"

if [[ ! -d "$BACKEND_DIR" ]]; then
  echo "Error: Backend directory not found at: $BACKEND_DIR" >&2
  exit 1
fi

echo "==> Building backend image: fishing-forum-backend:latest"
docker build -f "$BACKEND_DIR/Dockerfile" \
  -t fishing-forum-backend:latest \
  "$BACKEND_DIR"

echo "==> Done. Verify with: docker images | grep fishing-forum"
