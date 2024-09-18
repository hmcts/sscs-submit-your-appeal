/* eslint init-declarations: ["error", "never"]*/
const language = 'en';
const commonContent = require('commonContent')[language];
const moment = require('moment');
const testUser = require('../../util/IdamUser');

const { test } = require('@playwright/test');
const { createTheSession } = require('../page-objects/session/createSession');
const { endTheSession } = require('../page-objects/session/endSession');
const {
  enterDetailsForNewApplication,
  enterDetailsToArchiveACase
} = require('../page-objects/cya/checkYourAppeal');

test.describe(`${language.toUpperCase()} - Citizen, Sign in scenarios for SYA`, () => {
  let userEmail;

  Before(async({ page }) => {
    await createTheSession(page, language);
    userEmail = testUser.createUser();
  });

  After(async({ page }) => {
    await endTheSession(page);
    testUser.deleteUser(userEmail);
  });

  test(`${language.toUpperCase()} - Sign in as a new user and create a new application @fullFunctional`, async({
    page
  }) => {
    await moment().locale(language);
    await enterDetailsForNewApplication(
      page,
      commonContent,
      language,
      userEmail
    );
    await enterDetailsToArchiveACase(page, commonContent, language, userEmail);
  });
});
