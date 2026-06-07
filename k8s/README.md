# FishNet — Kubernetes Deployment Guide

This guide walks through deploying the full FishNet stack — **React frontend**, **Spring Boot backend**, and **PostgreSQL** — on a local **Minikube** cluster.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Minikube Cluster                                  │
│                                                                             │
│  Host machine                                                               │
│       │                                                                     │
│       │  NodePort :30080                                                    │
│       ▼                                                                     │
│  ┌──────────────────────┐                                                   │
│  │  fishing-forum-      │  Nginx serves React SPA                           │
│  │  frontend (Pod)      │  Proxies /api/*  ──────────────┐                  │
│  │  :80                 │  Proxies /uploads/* ─────────┼──┐               │
│  └──────────────────────┘                                  │  │               │
│                                                            ▼  ▼               │
│  ┌──────────────────────┐         JDBC          ┌──────────────────────┐   │
│  │  fishing-forum-      │◄──────────────────────│  fishing-forum-      │   │
│  │  backend (Pod)       │                       │  postgres (Pod)      │   │
│  │  :8080               │                       │  :5432               │   │
│  │  PVC: uploads-pvc    │                       │  PVC: postgres-pvc   │   │
│  └──────────────────────┘                       └──────────────────────┘   │
│                                                                             │
│  ConfigMap: fishing-forum-config   (DB_URL, UPLOAD_DIR)                    │
│  Secret:    fishing-forum-secrets  (DB_USER, DB_PASS, JWT_SECRET)          │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Component | Image | Service | Exposure |
|-----------|-------|---------|----------|
| Frontend | `fishing-forum-frontend:latest` | `fishing-forum-frontend` | NodePort **30080** |
| Backend | `fishing-forum-backend:latest` | `fishing-forum-backend` | ClusterIP :8080 |
| Database | `postgres:16-alpine` | `fishing-forum-postgres` | ClusterIP :5432 |

The browser talks only to the frontend. Nginx reverse-proxies API and upload requests to the backend, avoiding CORS issues.

---

## Prerequisites

| Tool | Minimum version | Verify |
|------|-----------------|--------|
| [Minikube](https://minikube.sigs.k8s.io/docs/start/) | 1.32+ | `minikube version` |
| [Docker](https://docs.docker.com/get-docker/) | 24+ | `docker version` |
| [kubectl](https://kubernetes.io/docs/tasks/tools/) | 1.28+ | `kubectl version --client` |
| Backend source | Spring Boot project | `../FishNetBackend/chmura_projekt` |

Recommended Minikube resources:

```bash
minikube start --cpus=4 --memory=6144 --driver=docker
minikube addons enable metrics-server   # optional
```

---

## Repository layout

```
FishNet/
├── Dockerfile                    # Frontend multi-stage build (Node → Nginx)
├── nginx.conf                    # SPA + /api + /uploads reverse proxy
├── docker/backend/Dockerfile     # Backend multi-stage build (Maven → JRE)
├── k8s/
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── postgres-pvc.yaml
│   ├── postgres-deployment.yaml
│   ├── postgres-service.yaml
│   ├── uploads-pvc.yaml
│   ├── backend-deployment.yaml   # replaces legacy app-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   └── schema.sql
└── scripts/
    ├── build-images.sh           # Build images inside Minikube Docker
    └── deploy-minikube.sh        # Full deploy orchestration
```

---

## Quick start (automated)

```bash
# 1. Start Minikube
minikube start

# 2. Deploy everything (builds images + applies manifests)
./scripts/deploy-minikube.sh

# 3. Open the app
minikube service fishing-forum-frontend --url
# Expected: http://192.168.x.x:30080
```

Register a user via the UI, create a category (requires admin), or seed data manually (see below).

---

## Manual step-by-step deployment

### Step 1 — Point Docker at Minikube

Building images on the host Docker daemon makes them invisible to Minikube. Always build **inside** the Minikube environment:

```bash
eval $(minikube docker-env)
```

Verify:

```bash
docker context ls    # should show minikube
```

To switch back to host Docker later:

```bash
eval $(minikube docker-env -u)
```

### Step 2 — Build local images

```bash
# From the FishNet (frontend) directory:
docker build -t fishing-forum-frontend:latest .

# Backend — build context is the Spring Boot project:
docker build -f docker/backend/Dockerfile \
  -t fishing-forum-backend:latest \
  ../FishNetBackend/chmura_projekt
```

Or use the helper script (runs `minikube docker-env` automatically):

```bash
./scripts/build-images.sh
```

Both images use `imagePullPolicy: Never` in the manifests, so Minikube uses the locally built images without pulling from a registry.

### Step 3 — Apply manifests in order

```bash
# 1. Configuration
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

# 2. Database
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/postgres-service.yaml
kubectl rollout status deployment/fishing-forum-postgres

# 3. Schema (run once)
kubectl exec -i deploy/fishing-forum-postgres -- \
  psql -U forum -d fishing_forum < k8s/schema.sql

# 4. Backend
kubectl apply -f k8s/uploads-pvc.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl rollout status deployment/fishing-forum-backend

# 5. Frontend
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl rollout status deployment/fishing-forum-frontend
```

### Step 4 — Verify deployment

```bash
kubectl get pods
kubectl get svc
kubectl get pvc
```

Expected pods (all `Running`):

```
fishing-forum-frontend-xxxxx    1/1   Running
fishing-forum-backend-xxxxx     1/1   Running
fishing-forum-postgres-xxxxx    1/1   Running
```

### Step 5 — Access the application

```bash
minikube service fishing-forum-frontend --url
```

Or directly: `http://$(minikube ip):30080`

---

## Seed data (optional)

The database starts empty. To add a starter category:

```bash
kubectl exec -it deploy/fishing-forum-postgres -- psql -U forum -d fishing_forum
```

```sql
INSERT INTO categories (name, description, position, created_at)
VALUES ('General Fishing', 'General discussion for all anglers', 1, NOW());
```

Then register via the UI (`/register`) and create threads.

---

## Environment configuration

### ConfigMap (`fishing-forum-config`)

| Key | Value |
|-----|-------|
| `DB_URL` | `jdbc:postgresql://fishing-forum-postgres:5432/fishing_forum` |
| `UPLOAD_DIR` | `/app/uploads` |

### Secret (`fishing-forum-secrets`)

| Key | Default (base64) | Plaintext |
|-----|------------------|-----------|
| `DB_USER` | `Zm9ydW0=` | `forum` |
| `DB_PASS` | `Zm9ydW0=` | `forum` |
| `JWT_SECRET` | (see manifest) | `change-me-…` |

**Change secrets before any non-local deployment:**

```bash
echo -n 'your-password' | base64
kubectl edit secret fishing-forum-secrets
```

---

## Troubleshooting

### ImagePullBackOff

**Cause:** Cluster cannot find the image (built on host Docker, not Minikube).

**Fix:**

```bash
eval $(minikube docker-env)
./scripts/build-images.sh
kubectl rollout restart deployment/fishing-forum-frontend
kubectl rollout restart deployment/fishing-forum-backend
```

Confirm `imagePullPolicy: Never` is set in deployment manifests.

### CrashLoopBackOff (backend)

**Cause:** Database not ready, schema missing, or wrong credentials.

**Fix:**

```bash
kubectl logs deploy/fishing-forum-backend
kubectl logs deploy/fishing-forum-postgres
kubectl exec -i deploy/fishing-forum-postgres -- psql -U forum -d fishing_forum < k8s/schema.sql
```

### CrashLoopBackOff (frontend)

**Cause:** Nginx config error or missing build assets.

**Fix:**

```bash
kubectl logs deploy/fishing-forum-frontend
docker build -t fishing-forum-frontend:latest .   # rebuild inside minikube docker-env
```

### API returns 502 / connection refused

**Cause:** Backend pod not ready or service name mismatch.

**Fix:**

```bash
kubectl get pods -l app=fishing-forum-backend
kubectl port-forward svc/fishing-forum-backend 8080:8080
curl http://localhost:8080/api/categories
```

Ensure `nginx.conf` proxies to `http://fishing-forum-backend:8080`.

### PVC Pending

**Cause:** Minikube storage provisioner not running.

**Fix:**

```bash
minikube addons enable default-storageclass
minikube addons enable storage-provisioner
kubectl describe pvc postgres-pvc
```

### Attachments / images not loading

**Cause:** `/uploads` not proxied or backend volume empty.

**Fix:** Confirm `nginx.conf` has the `/uploads/` location block and the backend mounts `uploads-pvc` at `/app/uploads`.

---

## Teardown

```bash
kubectl delete -f k8s/frontend-service.yaml
kubectl delete -f k8s/frontend-deployment.yaml
kubectl delete -f k8s/backend-service.yaml
kubectl delete -f k8s/backend-deployment.yaml
kubectl delete -f k8s/postgres-service.yaml
kubectl delete -f k8s/postgres-deployment.yaml
kubectl delete -f k8s/postgres-pvc.yaml
kubectl delete -f k8s/uploads-pvc.yaml
kubectl delete -f k8s/secret.yaml
kubectl delete -f k8s/configmap.yaml
```

Or delete everything at once:

```bash
kubectl delete -f k8s/ --recursive
```

PVC data persists until PVCs are deleted explicitly.

---

## Production notes

- Replace placeholder secrets in `secret.yaml`.
- Use a container registry instead of `imagePullPolicy: Never`.
- Enable TLS (Ingress + cert-manager).
- Scale backend replicas only with ReadWriteMany storage or object storage for uploads.
- Consider Flyway/Liquibase for schema migrations instead of manual `schema.sql`.
