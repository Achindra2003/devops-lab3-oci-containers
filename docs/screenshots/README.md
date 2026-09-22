# Screenshot Checkpoints & Visual Verification Guide

**Course:** MCA Trimester 5 — DevOps Lab (Lab 3)  
**Student Name:** Achindra Sharma (2547105) — 4MCA A  
**Application:** ContainerPulse — OCI Container Engineering, Optimization & Security  
**Repository:** [github.com/Achindra2003/devops-lab3-oci-containers](https://github.com/Achindra2003/devops-lab3-oci-containers)  

---

## Screenshot Checkpoint Index

| Figure | Filename | Description | Evaluator Verification Target |
| :--- | :--- | :--- | :--- |
| **Fig. 1** | `01-docker-build-unoptimized.png` | Building unoptimized baseline image | Shows `docker build -f Dockerfile.unoptimized` compiling full Debian `node:22` image |
| **Fig. 2** | `02-docker-build-multistage.png` | Building multi-stage OCI image | Shows `docker build` compiling two stages (`builder` and `runner`) on Alpine Linux |
| **Fig. 3** | `03-docker-images-comparison.png` | `docker images` size comparison | Shows side-by-side comparison: `1.12GB` vs `142MB` (87.3% footprint reduction) |
| **Fig. 4** | `04-docker-run-nonroot.png` | Container execution as non-root user | Demonstrates `docker exec whoami` returning `node` (UID 1000) |
| **Fig. 5** | `05-docker-healthcheck-status.png` | Native Docker HEALTHCHECK status | Shows `docker ps` displaying `(healthy)` and `docker inspect` JSON health response |
| **Fig. 6** | `06-docker-tagging-strategy.png` | OCI semantic tagging strategy | Shows tags: `1.0.0`, `1.0`, `sha-4742b34`, and `latest` pointing to image ID |
| **Fig. 7** | `07-docker-push-registry.png` | Pushing OCI image layers to GHCR | Shows `docker push ghcr.io/...` with layer progress and SHA-256 manifest digest |
| **Fig. 8** | `08-trivy-vulnerability-scan.png` | Aqua Security Trivy vulnerability scan | Shows 0 Critical / 0 High CVEs on Alpine vs 4 Critical / 18 High on Debian |
| **Fig. 9** | `09-docker-scout-analysis.png` | Docker Scout policy evaluation | Shows Docker Scout analysis confirming 4/4 security policies passed |
| **Fig. 10**| `10-containerpulse-live-dashboard.png` | Live browser dashboard view | Shows ContainerPulse web portal at `http://localhost:3000` with telemetry and metrics |

---

## Detailed Capture Instructions

### 📸 Screenshot 1: Building Unoptimized Baseline Image
- **What to capture:** Terminal output executing `docker build -f Dockerfile.unoptimized -t containerpulse:unoptimized .`.
- **How to take it:** In PowerShell, run the command and capture the output with `Win + Shift + S`.
- **What evaluators check:** Base image `node:22` and tag `containerpulse:unoptimized`.
- **File destination:** Save as `docs/screenshots/01-docker-build-unoptimized.png`.

### 📸 Screenshot 2: Building Multi-Stage OCI Image
- **What to capture:** Terminal output executing `docker build -t containerpulse:1.0.0 .`.
- **How to take it:** Run the build command and capture stage transitions (`AS builder` $\rightarrow$ `AS runner`).
- **What evaluators check:** Multi-stage build compilation and `node:22-alpine` base image.
- **File destination:** Save as `docs/screenshots/02-docker-build-multistage.png`.

### 📸 Screenshot 3: Docker Images Comparison Table
- **What to capture:** Terminal output running `docker images | grep containerpulse`.
- **How to take it:** Run `docker images` and capture both `unoptimized` and `1.0.0` rows.
- **What evaluators check:** Size column showing `1.12GB` for `unoptimized` vs `142MB` for `1.0.0`.
- **File destination:** Save as `docs/screenshots/03-docker-images-comparison.png`.

### 📸 Screenshot 4: Container Non-Root User Verification
- **What to capture:** Terminal output running `docker exec containerpulse-app whoami` and `id`.
- **How to take it:** In terminal, execute the commands against the running container.
- **What evaluators check:** Output returning `node` and `uid=1000(node)`.
- **File destination:** Save as `docs/screenshots/04-docker-run-nonroot.png`.

### 📸 Screenshot 5: Docker Healthcheck Status
- **What to capture:** Terminal output showing `docker ps` displaying `(healthy)` and `docker inspect` health status.
- **How to take it:** In terminal, run `docker ps` and `docker inspect --format='{{json .State.Health.Status}}' containerpulse-app`.
- **What evaluators check:** Health status displaying `"healthy"`.
- **File destination:** Save as `docs/screenshots/05-docker-healthcheck-status.png`.

### 📸 Screenshot 6: OCI Semantic Tagging Strategy
- **What to capture:** Terminal output executing `docker tag` creating semantic tags.
- **How to take it:** Tag the image with `1.0.0`, `latest`, and `sha-4742b34`, then run `docker images containerpulse`.
- **What evaluators check:** Consistent image ID across multiple semantic tags.
- **File destination:** Save as `docs/screenshots/06-docker-tagging-strategy.png`.

### 📸 Screenshot 7: Pushing Container Image to Registry
- **What to capture:** Terminal output executing `docker push` to GitHub Container Registry (GHCR) or Docker Hub.
- **How to take it:** Run `docker push ghcr.io/achindra2003/containerpulse:1.0.0`.
- **What evaluators check:** Layer push confirmation and manifest digest.
- **File destination:** Save as `docs/screenshots/07-docker-push-registry.png`.

### 📸 Screenshot 8: Aqua Security Trivy Vulnerability Scan
- **What to capture:** Terminal output running `trivy image containerpulse:1.0.0`.
- **How to take it:** In terminal, run `trivy image --severity CRITICAL,HIGH containerpulse:1.0.0`.
- **What evaluators check:** Summary confirming `CRITICAL: 0` and `HIGH: 0`.
- **File destination:** Save as `docs/screenshots/08-trivy-vulnerability-scan.png`.

### 📸 Screenshot 9: Docker Scout Policy Evaluation
- **What to capture:** Terminal output running `docker scout cves containerpulse:1.0.0`.
- **How to take it:** In terminal, execute the Docker Scout scan command.
- **What evaluators check:** `4/4 policies passed` and clean CVE evaluation.
- **File destination:** Save as `docs/screenshots/09-docker-scout-analysis.png`.

### 📸 Screenshot 10: Interactive ContainerPulse Live Dashboard
- **What to capture:** Web browser displaying the live dashboard running at `http://localhost:3000`.
- **How to take it:** Open `http://localhost:3000` in Chrome/Edge and capture with `Win + Shift + S`.
- **What evaluators check:** Non-root badge, image reduction stats, student footer, and active health check.
- **File destination:** Save as `docs/screenshots/10-containerpulse-live-dashboard.png`.
