const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');
async function signOut(page, language) {
  if (language === 'en') {
    page.retry({ retries: 3, minTimeout: 5000 }).click('Sign Out');
  } else {
    page.retry({ retries: 3, minTimeout: 5000 }).click('Allgofnodi');
  }
  await page.waitForTimeout(1000);
}

async function navigateToSignOut(page) {
  await page.goto(`${baseUrl}/sign-out`);
  await page.waitForTimeout(2000);
}

module.exports = { signOut, navigateToSignOut };
