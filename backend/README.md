# Fishing Forum Backend
Spring Boot backend for a fishing forum with JWT auth, categories, threads, posts, tags, moderation, search, and attachments.

## API notes
- Auth endpoints: `/api/auth/register`, `/api/auth/login`
- Read-only endpoints (GET) are public; writes require JWT.
- Moderation endpoints under `/api/mod` require role MOD or ADMIN.

## Kubernetes
See the manifests in `k8s/`. Replace placeholder secrets and adjust resource requests.

## Storage for attachments
For Kubernetes, mount a persistent volume.
