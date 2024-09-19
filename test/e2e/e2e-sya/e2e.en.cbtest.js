/* eslint-disable no-process-env */
const { test } = require('@playwright/test');
const content = require('../../../commonContent');
const { createTheSession } = require('../page-objects/session/createSession');
const { enterDetailsFromStartToNINO } = require('../page-objects/cya/checkYourAppeal');
const { endTheSession } = require('../page-objects/session/endSession');

test.describe('Crossbrowser - PIP E2E SYA - Full Journey @crossbrowser', () => {
  test('English - PIP E2E SYA Journey', async({ page }) => {
    const commonContent = content.en;
    const language = 'en';

    await createTheSession(page, language);

    await page.waitForTimeout(1000);
    await enterDetailsFromStartToNINO(page, commonContent, language);
    await endTheSession(page);
  });

  test('Welsh - PIP E2E SYA Journey', async({ page }) => {
    const commonContent = content.cy;
    const language = 'cy';

    await createTheSession(page, language);

    await page.waitForTimeout(1000);
    await enterDetailsFromStartToNINO(page, commonContent, language);
    await endTheSession(page);
  });
});
