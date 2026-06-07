# ── Stage 1: Build production assets ─────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# API calls use relative /api — Nginx proxies to the backend in Kubernetes.
RUN npm run build

# ── Stage 2: Serve with Nginx + reverse proxy ────────────────────────────────
FROM nginx:1.27-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
