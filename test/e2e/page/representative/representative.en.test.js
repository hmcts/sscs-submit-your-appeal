const language = 'en';
const commonContent = require('commonContent')[language];
const paths = require('paths');

const { test } = require('@playwright/test');

test.describe(`${language.toUpperCase()} - Representative @batch-10`, () => {
  Before(async({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.representative.representative);
  });

  After(async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I select yes, I am taken to the representative details page`, ({ page }) => {
    selectDoYouHaveARepresentativeAndContinue(page, commonContent, '#hasRepresentative-yes');
    page.seeInCurrentUrl(paths.representative.representativeDetails);
  });

  test(`${language.toUpperCase()} - When I select No, I am taken to the reason for appealing page`, ({ page }) => {
    selectDoYouHaveARepresentativeAndContinue(page, commonContent, '#hasRepresentative-no');
    page.seeInCurrentUrl(paths.reasonsForAppealing.reasonForAppealing);
  });

  test(`${language.toUpperCase()} - I have a csrf token`, ({ page }) => {
    page.seeElementInDOM('form input[name="_csrf"]');
  });
});
