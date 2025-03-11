const haveMRNContentEn = require('steps/compliance/have-a-mrn/content.en');
const haveMRNContentCy = require('steps/compliance/have-a-mrn/content.cy');
const { expect } = require('@playwright/test');

async function selectHaveYouGotAMRNAndContinue(
  I,
  language,
  commonContent,
  option
) {
  const haveMRNContent = language === 'en' ? haveMRNContentEn : haveMRNContentCy;

  await expect(I.getByText(haveMRNContent.title).first()).toBeVisible();
  await I.locator(option).first().check();
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function selectHaveYouGotAMRNAndContinueAfterSignIn(
  I,
  language,
  commonContent,
  option
) {
  const haveMRNContent = language === 'en' ? haveMRNContentEn : haveMRNContentCy;

  await expect(I.getByText(haveMRNContent.title).first()).toBeVisible();
  await I.locator(option).check();
  await I.getByRole('button', { name: commonContent.saveAndContinue })
    .first()
    .click();
}

module.exports = {
  selectHaveYouGotAMRNAndContinue,
  selectHaveYouGotAMRNAndContinueAfterSignIn
};
