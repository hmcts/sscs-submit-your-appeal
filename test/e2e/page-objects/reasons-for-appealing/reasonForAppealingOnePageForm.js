const assert = require('assert');
const reasonForAppealingContentEn = require('steps/reasons-for-appealing/reason-for-appealing/content.en');
const reasonForAppealingContentCy = require('steps/reasons-for-appealing/reason-for-appealing/content.cy');
const { expect } = require('@playwright/test');

async function hasErrorClass(page, item) {
  const classes = await page.locator(`${item} div`).getAttribute('class');
  const hasClass = classes.includes('govuk-form-group--error');
  assert.equal(hasClass, true);
}

async function addAReasonForAppealing(page, language, whatYouDisagreeWithField, reasonForAppealingField, reason) {
  const reasonForAppealingContent = language === 'en' ? reasonForAppealingContentEn : reasonForAppealingContentCy;

  await expect(page.getByText(reasonForAppealingContent.title)).toBeVisible({ timeout: 45000 });
  await page.locator(whatYouDisagreeWithField).first().waitFor({ timeout: 5000 });
  await page.fill(whatYouDisagreeWithField, reason.whatYouDisagreeWith);
  await page.fill(reasonForAppealingField, reason.reasonForAppealing);
}

async function addAReasonForAppealingAndThenClickAddAnother(page,
  language,
  whatYouDisagreeWithField,
  reasonForAppealingField,
  reason
) {
  await addAReasonForAppealing(page, language, whatYouDisagreeWithField, reasonForAppealingField, reason);
  await page.click('Add reason');
}

async function addReasonForAppealingUsingTheOnePageFormAndContinue(page, language, commonContent, reason) {
  await page.waitForTimeout(5000);
  await addAReasonForAppealing(page,
    language,
    '#items-0 #item\\.whatYouDisagreeWith-0',
    '#items-0 #item\\.reasonForAppealing-0',
    reason
  );
  await page.click(commonContent.continue);
}

async function addReasonForAppealingUsingTheOnePageFormAfterSignIn(page, language, commonContent, reason) {
  await addAReasonForAppealing(page,
    language,
    '#items-0 #item\\.whatYouDisagreeWith-0',
    '#items-0 #item\\.reasonForAppealing-0',
    reason
  );
  await page.click(commonContent.saveAndContinue);
}

module.exports = {
  hasErrorClass,
  addAReasonForAppealing,
  addAReasonForAppealingAndThenClickAddAnother,
  addReasonForAppealingUsingTheOnePageFormAndContinue,
  addReasonForAppealingUsingTheOnePageFormAfterSignIn
};
