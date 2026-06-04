# Fishing Forum Backend

Spring Boot backend for a fishing forum with JWT auth, categories, threads, posts, tags, moderation, search, and attachments.

## Requirements
- Java 21
- Maven 3.9+
- PostgreSQL

## Run locally
1. Create database and user or use the defaults below.
2. Set env vars (optional):
   - `DB_URL` (default: `jdbc:postgresql://localhost:5432/fishing_forum`)
   - `DB_USER` (default: `forum`)
   - `DB_PASS` (default: `forum`)
   - `JWT_SECRET` (default: `change-me`)
   - `UPLOAD_DIR` (default: `uploads`)
3. Run:
   ```bash
   mvn spring-boot:run
   ```

## API notes
- Auth endpoints: `/api/auth/register`, `/api/auth/login`
- Read-only endpoints (GET) are public; writes require JWT.
- Moderation endpoints under `/api/mod` require role MOD or ADMIN.

## Kubernetes
See the manifests in `k8s/`. Replace placeholder secrets and adjust resource requests.

## Storage for attachments
Attachments are stored on the local filesystem at `UPLOAD_DIR`. For Kubernetes, mount a persistent volume.
