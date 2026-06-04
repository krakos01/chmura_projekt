# Kubernetes

Use this when the backend and frontend are both deployed in Kubernetes.

## Apply backend manifests

Apply manifests in this order:
1. `configmap.yaml`
2. `secret.yaml`
3. `postgres-deployment.yaml`
4. `postgres-service.yaml`
5. `app-deployment.yaml`
6. `app-service.yaml`

Before applying, make sure:
- The backend image name in `app-deployment.yaml` points to an image your cluster can pull, or load a local image into Minikube.
- `secret.yaml` contains real values.
- 

Example local Minikube flow:

```bash
docker build -t test:latest .
minikube image load test:latest
kubectl apply -f k8s/
```

## Frontend integration

If the frontend runs in the same Kubernetes cluster, it should call the backend by service name:

```text
http://fishing-forum
```

That works because the backend service is `ClusterIP` and is reachable inside the cluster.

If the frontend runs locally instead of in Kubernetes, port-forward the backend service:

```bash
kubectl port-forward svc/fishing-forum 8080:80
```

Then use:

```text
http://127.0.0.1:8080
```

## Seed data

This backend starts with an empty database. Before the frontend can show posts, you need to create the schema, then seed at least one category and one thread.

### Create the schema

Apply the schema SQL to the Postgres database pod before applying app-deployment:

```bash
kubectl exec -i deploy/fishing-forum-postgres -- psql -U forum -d fishing_forum < k8s/schema.sql
```

If the database already exists and you only need the tables, this is enough.

### Seed initial data

Create a category directly in Postgres:

```bash
kubectl exec -it deploy/fishing-forum-postgres -- psql -U forum -d fishing_forum
```

Then run:

```sql
insert into categories (name, description, position, created_at)
values ('General', 'General discussion', 1, now());
```

After that, register a user, create a thread, and create posts through the API.

## Production notes

Use a PersistentVolume for `uploads` and `pgdata` in production.
