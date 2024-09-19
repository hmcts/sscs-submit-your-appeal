/* eslint-disable-next-line no-process-env */
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

async function endTheSession(page) {
  await page.goto(`${baseUrl}/exit`, 'to end the current session');
}

module.exports = { endTheSession };
