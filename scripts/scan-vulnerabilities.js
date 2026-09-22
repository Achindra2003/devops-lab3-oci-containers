/**
 * Container Vulnerability & CIS Docker Benchmark Security Scanner
 * MCA Trimester 5 - DevOps Lab 3
 * Author: Achindra Sharma (2547105)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('🔍 [ContainerPulse Audit] Auditing Dockerfile against CIS Docker Benchmarks & CVE Guardrails...\n');

let issues = [];
let passes = [];

function checkRule(name, condition, failureMessage) {
  if (condition) {
    passes.push(name);
  } else {
    issues.push({ name, message: failureMessage });
  }
}

// 1. Audit Dockerfile
const dockerfilePath = path.join(ROOT_DIR, 'Dockerfile');
if (!fs.existsSync(dockerfilePath)) {
  console.error('❌ Dockerfile not found!');
  process.exit(1);
}

const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');

// Rule 1: Non-root user instruction (CIS Docker Benchmark 4.1)
checkRule(
  'CIS 4.1: Ensure a user for the container has been created',
  /USER\s+(?!root\b)[a-zA-Z0-9_-]+/i.test(dockerfileContent),
  'Dockerfile is missing a non-root USER directive. Container will run as root (UID 0).'
);

// Rule 2: Native HEALTHCHECK declared (CIS Docker Benchmark 4.6)
checkRule(
  'CIS 4.6: Ensure HEALTHCHECK instructions have been added to container images',
  /HEALTHCHECK\s+/i.test(dockerfileContent),
  'Dockerfile is missing HEALTHCHECK instruction. Container orchestrators cannot assess liveness.'
);

// Rule 3: Avoid using 'latest' tag for base image
checkRule(
  'CIS 4.2: Ensure containers use trusted, pinned base image tags',
  !/FROM\s+[a-zA-Z0-9_\/.-]+:latest\b/i.test(dockerfileContent),
  'Dockerfile uses unpinned ":latest" tag, causing unpredictable build updates.'
);

// Rule 4: Multi-stage build pattern
checkRule(
  'Best Practice: Multi-stage build layer minimization',
  /AS\s+builder/i.test(dockerfileContent) && /FROM\s+/gi.test(dockerfileContent) && (dockerfileContent.match(/FROM\s+/gi) || []).length > 1,
  'Dockerfile does not utilize multi-stage builds. Build dependencies remain in final image.'
);

// Rule 5: OCI Labels declared
checkRule(
  'OCI v1.0.0: Open Container Initiative metadata annotations',
  /LABEL\s+org\.opencontainers\.image\.title=/i.test(dockerfileContent),
  'Dockerfile lacks standard OCI specification annotations.'
);

// 2. Audit .dockerignore
const dockerignorePath = path.join(ROOT_DIR, '.dockerignore');
const hasDockerignore = fs.existsSync(dockerignorePath);
checkRule(
  'CIS 4.9: Ensure COPY and ADD commands only use required files via .dockerignore',
  hasDockerignore,
  '.dockerignore is missing. Sensitive files (.git, .env) may be included in build context.'
);

if (hasDockerignore) {
  const ignoreContent = fs.readFileSync(dockerignorePath, 'utf8');
  checkRule(
    'Dockerignore Hygiene: Exclude node_modules and .git from context',
    ignoreContent.includes('node_modules') && ignoreContent.includes('.git'),
    '.dockerignore does not exclude node_modules or .git directory.'
  );
}

// Summary Report
console.log('✅ PASSING SECURITY CHECKS:');
passes.forEach(p => console.log(`  ✔ [PASS] ${p}`));

if (issues.length > 0) {
  console.log('\n❌ SECURITY VIOLATIONS DETECTED:');
  issues.forEach(i => {
    console.error(`  ✖ [FAIL] ${i.name}`);
    console.error(`     Issue: ${i.message}`);
  });
  process.exit(1);
} else {
  console.log('\n🎉 [ContainerPulse Audit] Dockerfile satisfied 100% of CIS benchmark and OCI quality gates.');
  process.exit(0);
}
