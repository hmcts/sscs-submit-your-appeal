const appointeeContentEn = require('steps/identity/appointee/content.en');
const appointeeContentCy = require('steps/identity/appointee/content.cy');
const { expect } = require('@playwright/test');

async function selectAreYouAnAppointeeAndContinue(
  I,
  language,
  commonContent,
  option
) {
  const appointeeContent =
    language === 'en' ? appointeeContentEn : appointeeContentCy;

  await expect(
    I.getByText(
      appointeeContent.fields.isAppointee.yes.replace('{{appointedBy}}', 'DWP')
    ).first()
  ).toBeVisible();
  await I.locator(option).first().check();
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function selectAreYouAnAppointeeAndContinueAfterSignIn(
  I,
  language,
  commonContent,
  option
) {
  const appointeeContent =
    language === 'en' ? appointeeContentEn : appointeeContentCy;

  await expect(
    I.getByText(
      appointeeContent.fields.isAppointee.yes.replace('{{appointedBy}}', 'DWP')
    ).first()
  ).toBeVisible();
  await I.locator(option).first().check();
  await I.getByRole('button', { name: commonContent.saveAndContinue })
    .first()
    .click();
}

module.exports = {
  selectAreYouAnAppointeeAndContinue,
  selectAreYouAnAppointeeAndContinueAfterSignIn
};
