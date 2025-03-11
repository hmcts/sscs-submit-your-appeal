const paths = require('paths');
const { test } = require('@playwright/test');
const assert = require('assert');

test.describe('Health', () => {
  test('The API is up, healthy and responding to requests to /health', async({
    request
  }) => {
    const response = await request.get(paths.health);
    const res = await response.json();
    assert(res.status === 'UP');
  });
});
