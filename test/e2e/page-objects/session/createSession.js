/* eslint-disable-next-line no-process-env */
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

async function createTheSession(page, language) {
  await page.goto(`${baseUrl}/entry?lng=${language}`, `to create a session in ${language.toUpperCase()}`);
}

module.exports = { createTheSession };
