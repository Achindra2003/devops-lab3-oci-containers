import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import server from '../server.js';

test('ContainerPulse Microservice Tests', async (t) => {
  const TEST_PORT = 3899;

  await new Promise((resolve) => {
    server.listen(TEST_PORT, '127.0.0.1', () => resolve());
  });

  function makeRequest(path) {
    return new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${TEST_PORT}${path}`, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          });
        });
      }).on('error', reject);
    });
  }

  await t.test('GET /healthz returns 200 HEALTHY status', async () => {
    const res = await makeRequest('/healthz');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'HEALTHY');
    assert.strictEqual(res.body.service, 'ContainerPulse');
    assert.ok(typeof res.body.uptimeSeconds === 'number');
  });

  await t.test('GET /livez returns 200 READY status', async () => {
    const res = await makeRequest('/livez');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'READY');
    assert.strictEqual(res.body.ready, true);
    assert.strictEqual(res.body.subsystems.memory, 'OK');
  });

  await t.test('GET /api/container-info returns runtime metrics and OCI metadata', async () => {
    const res = await makeRequest('/api/container-info');
    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.body.container.hostname);
    assert.ok(res.body.container.nodeVersion);
    assert.strictEqual(res.body.oci.title, 'ContainerPulse');
    assert.strictEqual(res.body.optimization.unoptimizedSizeMB, 1120);
    assert.strictEqual(res.body.optimization.optimizedSizeMB, 142);
    assert.strictEqual(res.body.optimization.reductionPercentage, 87.3);
  });

  server.close();
});
