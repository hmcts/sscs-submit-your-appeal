/* eslint init-declarations: ["error", "never"]*/
const { test } = require('@playwright/test');

const language = 'en';
const commonContent = require('commonContent')[language];
const moment = require('moment');
const testUser = require('../../util/IdamUser');
const { createTheSession } = require('../page-objects/session/createSession');
const { endTheSession } = require('../page-objects/session/endSession');
const {
  enterDetailsForNewApplication,
  enterDetailsToDeleteACase
} = require('../page-objects/cya/checkYourAppeal');

test.describe(`${language.toUpperCase()} - Citizen, Sign in scenarios for SYA`, () => {
  let userEmail;

  test.beforeEach('Create session and user', async({ page }) => {
    await createTheSession(page, language);
    userEmail = await testUser.createUser();
  });

  test.afterEach('End session and delete user', async({ page }) => {
    await endTheSession(page);
    await testUser.deleteUser(userEmail);
  });

  test(
    `${language.toUpperCase()} - Sign in as a new user and create a new application `,
    { tag: '@fullFunctional' },
    async({ page }) => {
      await moment().locale(language);
      await enterDetailsForNewApplication(
        page,
        commonContent,
        language,
        userEmail
      );
      await enterDetailsToDeleteACase(page, commonContent, language, userEmail);
    }
  );
});
