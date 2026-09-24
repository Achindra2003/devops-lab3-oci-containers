# =========================================================================
# PRODUCTION-GRADE MULTI-STAGE OCI-COMPLIANT DOCKERFILE
# MCA Trimester 5 - DevOps Lab 3
# Author: Achindra Sharma (2547105)
# =========================================================================

# -------------------------------------------------------------------------
# Stage 1: Build & Dependency Pruning Stage
# -------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /build

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies without generating cache bloat
RUN mkdir -p /build/node_modules && \
    npm ci --omit=dev --ignore-scripts && \
    npm cache clean --force

# -------------------------------------------------------------------------
# Stage 2: Hardened, Minimal, Non-Root Runtime Stage (~142 MB)
# -------------------------------------------------------------------------
FROM node:22-alpine AS runner

# Standardized Open Container Initiative (OCI) Image Specification Annotations
LABEL org.opencontainers.image.title="ContainerPulse" \
      org.opencontainers.image.description="Cloud-Native OCI-Compliant Container Telemetry & Quality Watchdog" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.authors="Achindra Sharma <2547105>" \
      org.opencontainers.image.source="https://github.com/Achindra2003/devops-lab3-oci-containers" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.base.name="docker.io/library/node:22-alpine" \
      org.opencontainers.image.vendor="Achindra Sharma"

# Set runtime environment
ENV NODE_ENV=production \
    PORT=3000 \
    BASE_IMAGE="node:22-alpine"

WORKDIR /app

# Non-Root Security Hardening: Ensure proper ownership before switching user
RUN chown -R node:node /app

# Copy production node_modules from builder stage
COPY --chown=node:node --from=builder /build/package*.json ./
# If node_modules exist, copy them
COPY --chown=node:node --from=builder /build/node_modules ./node_modules

# Copy application source code and public assets
COPY --chown=node:node server.js ./
COPY --chown=node:node public ./public

# Switch to non-root user (UID 1000: GID 1000) for least-privilege security
USER node

# Expose microservice HTTP port
EXPOSE 3000

# Native Container Healthcheck for Kubernetes / Docker Swarm Liveness Probes
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3000/healthz || exit 1

# Execute container process directly (PID 1 graceful signal termination)
CMD ["node", "server.js"]
