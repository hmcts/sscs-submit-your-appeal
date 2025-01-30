const otherReasonForAppealingContentEn = require('steps/reasons-for-appealing/other-reasons-for-appealing/content.en');
const otherReasonForAppealingContentCy = require('steps/reasons-for-appealing/other-reasons-for-appealing/content.cy');
const { expect } = require('@playwright/test');

async function enterAnythingElseAndContinue(I, language, commonContent, anythingElse) {
  const otherReasonForAppealingContent = language === 'en' ? otherReasonForAppealingContentEn : otherReasonForAppealingContentCy;

  await expect(I.getByText(otherReasonForAppealingContent.title).first()).toBeVisible();
  await I.locator('#otherReasonForAppealing').fill(anythingElse);
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function enterAnythingElseAfterSignIn(I, language, commonContent, anythingElse) {
  const otherReasonForAppealingContent = language === 'en' ? otherReasonForAppealingContentEn : otherReasonForAppealingContentCy;

  await expect(I.getByText(otherReasonForAppealingContent.title).first()).toBeVisible();
  await I.locator('#otherReasonForAppealing').fill(anythingElse);
  await I.getByRole('button', { name: commonContent.saveAndContinue }).first().click();
}

async function enterReasonForAppealAndContinue(I, commonContent, reason, link) {
  await I.getByText(link).first().click();
  await I.locator('input[name="item.whatYouDisagreeWith"]').fill(reason.whatYouDisagreeWith);
  await I.locator('textarea[name="item.reasonForAppealing"]').fill(reason.reasonForAppealing);
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function addReasonsForAppealingAndContinue(I, commonContent, reason, link) {
  await enterReasonForAppealAndContinue(I, commonContent, reason, link);
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

module.exports = {
  enterAnythingElseAndContinue,
  enterAnythingElseAfterSignIn,
  enterReasonForAppealAndContinue,
  addReasonsForAppealingAndContinue
};
