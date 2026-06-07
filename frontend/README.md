# FishNet — Angler's Forum

A modern, full-stack fishing forum: **React 19** frontend + **Spring Boot 3** backend + **PostgreSQL**, deployable locally with **Minikube**.

| Layer | Tech | Directory |
|-------|------|-----------|
| Frontend | React, TypeScript, Vite, MUI v9 | `FishNet/` (this repo) |
| Backend | Spring Boot 3.3, Java 21, JWT | `FishNetBackend/chmura_projekt/` |
| Database | PostgreSQL 16 | Kubernetes + PVC |

---

## Architecture (Kubernetes)

```
 Browser
    │
    │  http://<minikube-ip>:30080
    ▼
┌─────────────────┐     /api/*      ┌─────────────────┐
│    Frontend     │ ───────────────►│    Backend      │
│  Nginx + React  │     /uploads/*  │  Spring Boot    │
└─────────────────┘                 └────────┬────────┘
                                             │ JDBC
                                             ▼
                                    ┌─────────────────┐
                                    │   PostgreSQL    │
                                    │   (PVC-backed)  │
                                    └─────────────────┘
```

The frontend Nginx server serves the SPA and reverse-proxies `/api` and `/uploads` to the backend, so the browser never needs CORS configuration.

---

## Local development (without Kubernetes)

### Frontend

```bash
npm install
npm run dev      # http://localhost:5173 — proxies /api to localhost:8080
```

### Backend

Run the Spring Boot app from `FishNetBackend/chmura_projekt/` (requires local PostgreSQL). See the backend README for API details.

---

## Kubernetes deployment (Minikube)

**Full instructions:** [`k8s/README.md`](k8s/README.md)

### Prerequisites

- Minikube, Docker, kubectl
- Backend source at `../FishNetBackend/chmura_projekt`

### Quick deploy

```bash
minikube start --cpus=4 --memory=6144
./scripts/deploy-minikube.sh
minikube service fishing-forum-frontend --url
```

### Build images manually

```bash
eval $(minikube docker-env)
docker build -t fishing-forum-frontend:latest .
docker build -f docker/backend/Dockerfile \
  -t fishing-forum-backend:latest \
  ../FishNetBackend/chmura_projekt
```

### Manifest apply order

1. `configmap.yaml` + `secret.yaml`
2. PostgreSQL (PVC → deployment → service) + `schema.sql`
3. Backend (uploads PVC → deployment → service)
4. Frontend (deployment → service)

---

## Frontend features

- Stylish water-inspired UI with light/dark mode
- JWT authentication with role-based access
- Categories, threads, posts, attachments, search, tags
- Anyone can read; logged-in users can post

## Project structure

```
FishNet/
├── src/                  # React application source
├── Dockerfile            # Frontend container (Node build → Nginx)
├── nginx.conf            # SPA + API reverse proxy
├── docker/backend/       # Backend Dockerfile (build from sibling repo)
├── k8s/                  # Kubernetes manifests
├── scripts/              # build-images.sh, deploy-minikube.sh
└── k8s/README.md         # Detailed deployment & troubleshooting guide
```

## API overview

All API routes are prefixed with `/api`. See [`k8s/README.md`](k8s/README.md) for service discovery inside the cluster.

| Area | Method | Path |
|------|--------|------|
| Auth | POST | `/auth/register`, `/auth/login` |
| Categories | GET/POST | `/categories`, `/categories/{id}` |
| Threads | GET/POST | `/threads`, `/categories/{id}/threads` |
| Posts | GET/POST | `/posts`, `/threads/{id}/posts` |
| Attachments | GET/POST | `/posts/{id}/attachments` |
| Search | GET | `/search?q=` |
| Tags | GET | `/tags` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server with API proxy |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `./scripts/build-images.sh` | Build Docker images in Minikube |
| `./scripts/deploy-minikube.sh` | Full cluster deployment |

## License

Academic / project use.
