/* eslint-disable no-await-in-loop,max-depth */
const benefitContentEn = require('steps/start/benefit-type/content.en');
const benefitContentCy = require('steps/start/benefit-type/content.cy');
const { expect } = require('@playwright/test');
const paths = require("paths");

async function enterBenefitTypeAndContinue(I, language, commonContent, type) {
  await handleFlakey(I, language, type, commonContent.continue);
}

async function enterBenefitTypeAfterSignIn(I, language, commonContent, type) {
  await handleFlakey(I, language, type, commonContent.saveAndContinue);
}

async function handleFlakey(I, language, type, continueText) {
  const benefitContent = language === 'en' ? benefitContentEn : benefitContentCy;
  for (let i = 0; i < 5; i++) {
    await expect(I.getByText(benefitContent.title).first()).toBeVisible();
    try {
      await I.locator('#benefitType').first().pressSequentially(type);
      await I.locator('#benefitType__option--0').first().click();
      await I.getByRole('button', { name: continueText }).first().click();
      break;
    } catch (error) {
      if (i === 4) throw new Error(error);
      await I.goto(paths.start.benefitType);
      console.log(`Failed attempt ${i + 1}, trying again.`);
    }
  }
}

module.exports = { enterBenefitTypeAndContinue, enterBenefitTypeAfterSignIn };
