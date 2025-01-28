const assert = require('assert');
const reasonForAppealingContentEn = require('steps/reasons-for-appealing/reason-for-appealing/content.en');
const reasonForAppealingContentCy = require('steps/reasons-for-appealing/reason-for-appealing/content.cy');
const { expect } = require('@playwright/test');

async function hasErrorClass(I, item) {
  const classes = await I.locator(`${item} div`).getAttribute('class');
  const hasClass = classes.includes('govuk-form-group--error');
  assert.equal(hasClass, true);
}

async function addAReasonForAppealing(I, language, whatYouDisagreeWithField, reasonForAppealingField, reason) {
  const reasonForAppealingContent = language === 'en' ? reasonForAppealingContentEn : reasonForAppealingContentCy;

  await expect(I.getByText(reasonForAppealingContent.title).first()).toBeVisible();
  await expect(I.locator(whatYouDisagreeWithField).first()).toBeVisible();
  await I.locator(whatYouDisagreeWithField).first().fill(reason.whatYouDisagreeWith);
  await I.locator(reasonForAppealingField).first().fill(reason.reasonForAppealing);
}

async function addAReasonForAppealingAndThenClickAddAnother(I, language, whatYouDisagreeWithField,
  reasonForAppealingField, reason) {
  await addAReasonForAppealing(I, language, whatYouDisagreeWithField, reasonForAppealingField, reason);
  await I.getByText('Add reason').first().click();
}

async function addReasonForAppealingUsingTheOnePageFormAndContinue(I, language, commonContent, reason) {
  await addAReasonForAppealing(
    I,
    language,
    '#items-0 #item\\.whatYouDisagreeWith-0',
    '#items-0 #item\\.reasonForAppealing-0',
    reason
  );
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function addReasonForAppealingUsingTheOnePageFormAfterSignIn(I, language, commonContent, reason) {
  await addAReasonForAppealing(
    I,
    language,
    '#items-0 #item\\.whatYouDisagreeWith-0',
    '#items-0 #item\\.reasonForAppealing-0',
    reason
  );
  await I.getByRole('button', { name: commonContent.saveAndContinue }).first().click();
}

module.exports = {
  hasErrorClass,
  addAReasonForAppealing,
  addAReasonForAppealingAndThenClickAddAnother,
  addReasonForAppealingUsingTheOnePageFormAndContinue,
  addReasonForAppealingUsingTheOnePageFormAfterSignIn
};
