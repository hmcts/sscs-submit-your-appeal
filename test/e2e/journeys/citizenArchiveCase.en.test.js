/* eslint init-declarations: ["error", "never"]*/
const language = 'en';
const commonContent = require('commonContent')[language];
const moment = require('moment');
const testUser = require('../../util/IdamUser');

Feature(`${language.toUpperCase()} - Citizen, Sign in scenarios for SYA`);

let userEmail;

Before(({ I }) => {
  I.createTheSession(language);
  I.waitForElement('.govuk-button', 30);
  userEmail = testUser.createUser();
});

After(({ I }) => {
  I.endTheSession();
  testUser.deleteUser(userEmail);
});

Scenario(`${language.toUpperCase()} - Sign in as a new user and create a new application @fullFunctional`, async({ I }) => {
  await moment().locale(language);
  I.waitForElement('.govuk-button', 30);
  await I.enterDetailsForNewApplication(commonContent, language, userEmail);
  I.waitForElement('#application-summary', 30);
  await I.enterDetailsToArchiveACase(commonContent, language, userEmail);
}).retry(8);
