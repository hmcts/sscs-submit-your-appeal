const otherReasonForAppealingContentEn = require('steps/reasons-for-appealing/other-reasons-for-appealing/content.en');
const otherReasonForAppealingContentCy = require('steps/reasons-for-appealing/other-reasons-for-appealing/content.cy');
const { expect } = require('@playwright/test');

async function enterAnythingElseAndContinue(page, language, commonContent, anythingElse) {
  const otherReasonForAppealingContent = language === 'en' ? otherReasonForAppealingContentEn : otherReasonForAppealingContentCy;

  await expect(page.getByText(otherReasonForAppealingContent.title)).toBeVisible({ timeout: 45000 });
  await page.fill('#otherReasonForAppealing', anythingElse);
  await page.click(commonContent.continue);
}

async function enterAnythingElseAfterSignIn(page, language, commonContent, anythingElse) {
  const otherReasonForAppealingContent = language === 'en' ? otherReasonForAppealingContentEn : otherReasonForAppealingContentCy;

  await expect(page.getByText(otherReasonForAppealingContent.title)).toBeVisible({ timeout: 45000 });
  await page.fill('#otherReasonForAppealing', anythingElse);
  await page.click(commonContent.saveAndContinue);
}

async function enterReasonForAppealAndContinue(page, commonContent, reason, link) {
  await page.click(link);
  await page.fill('input[name="item.whatYouDisagreeWith"]', reason.whatYouDisagreeWith);
  await page.fill('textarea[name="item.reasonForAppealing"]', reason.reasonForAppealing);
  await page.click(commonContent.continue);
}

async function addReasonsForAppealingAndContinue(page, commonContent, reason, link) {
  await enterReasonForAppealAndContinue(page, commonContent, reason, link);
  await page.click(commonContent.continue);
}

module.exports = {
  enterAnythingElseAndContinue,
  enterAnythingElseAfterSignIn,
  enterReasonForAppealAndContinue,
  addReasonsForAppealingAndContinue
};
