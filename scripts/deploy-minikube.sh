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

# Ensure ingress addon is enabled when running in Minikube
if command -v minikube >/dev/null 2>&1; then
  echo "==> Ensuring Minikube ingress addon is enabled"
  minikube addons enable ingress || true
fi

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

# Apply Ingress manifest to expose frontend and route API/uploads to backend
if [[ -f "$K8S_DIR/ingress.yaml" ]]; then
  echo "==> Applying Ingress manifest"
  kubectl apply -f "$K8S_DIR/ingress.yaml"
fi

echo "==> 6/6 Deployment status"
kubectl get pods,svc,pvc

echo ""
echo "Access the application:"
echo "  # If using Ingress, map host 'fishnet.local' to the Minikube IP and open http://fishnet.local"
echo "  # To get the Minikube IP:"
echo "  minikube ip"
echo "  # Or (without Ingress) expose the frontend service URL:"
echo "  minikube service fishing-forum-frontend --url"
