import { describe, it } from 'node:test';
import assert from 'node:assert';
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:8080';

describe('Form Data API Tests', () => {
  it('GET /form-data returns form data with status 200', async () => {
    const response = await fetch(`${API_BASE_URL}/form-data`);
    assert.strictEqual(response.status, 200);
    const body = await response.json();
    assert.strictEqual(typeof body.total, 'number');
    assert.ok(Array.isArray(body.formData));
  });
});
