#!/usr/bin/env bash
# Deploy FishNet to a local Minikube cluster.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
K8S_DIR="$ROOT_DIR/k8s"

if ! command -v kubectl >/dev/null 2>&1; then
  echo "Error: kubectl is not installed or not in PATH." >&2
  exit 1
fi

echo "==> Building images in Minikube (if not already built)"
"$ROOT_DIR/scripts/build-images.sh"

echo "==> 1/6 Applying ConfigMap and Secrets"
kubectl apply -f "$K8S_DIR/configmap.yaml"
kubectl apply -f "$K8S_DIR/secret.yaml"

echo "==> 2/6 Starting PostgreSQL (with PVC)"
kubectl apply -f "$K8S_DIR/postgres-pvc.yaml"
kubectl apply -f "$K8S_DIR/postgres-deployment.yaml"
kubectl apply -f "$K8S_DIR/postgres-service.yaml"
kubectl rollout status deployment/fishing-forum-postgres --timeout=180s

echo "==> 3/6 Initialising database schema"
kubectl exec -i deploy/fishing-forum-postgres -- \
  psql -U forum -d fishing_forum < "$K8S_DIR/schema.sql" || {
  echo "Note: Schema may already exist — continuing."
}

echo "==> 4/6 Starting backend"
kubectl apply -f "$K8S_DIR/uploads-pvc.yaml"
kubectl apply -f "$K8S_DIR/backend-deployment.yaml"
kubectl apply -f "$K8S_DIR/backend-service.yaml"
kubectl rollout status deployment/fishing-forum-backend --timeout=300s

echo "==> 5/6 Starting frontend"
kubectl apply -f "$K8S_DIR/frontend-deployment.yaml"
kubectl apply -f "$K8S_DIR/frontend-service.yaml"
kubectl rollout status deployment/fishing-forum-frontend --timeout=120s

echo "==> 6/6 Deployment status"
kubectl get pods,svc,pvc

echo ""
echo "Access the application:"
echo "  minikube service fishing-forum-frontend --url"
echo "  # or open http://$(minikube ip):30080"
