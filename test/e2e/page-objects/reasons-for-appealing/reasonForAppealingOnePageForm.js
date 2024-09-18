const assert = require('assert');
const reasonForAppealingContentEn = require('steps/reasons-for-appealing/reason-for-appealing/content.en');
const reasonForAppealingContentCy = require('steps/reasons-for-appealing/reason-for-appealing/content.cy');

async function hasErrorClass(item) {
  

  const classes = await page.grabAttributeFrom(`${item} div`, 'class');
  const hasClass = classes.includes('govuk-form-group--error');
  assert.equal(hasClass, true);
}

function addAReasonForAppealing(language, whatYouDisagreeWithField, reasonForAppealingField, reason) {
  
  const reasonForAppealingContent = language === 'en' ? reasonForAppealingContentEn : reasonForAppealingContentCy;

  await expect(page.getByText(reasonForAppealingContent.title)).toBeVisible({ timeout: 45000 })
  page.waitForElement(whatYouDisagreeWithField, 5);
  await page.fill(whatYouDisagreeWithField, reason.whatYouDisagreeWith);
  await page.fill(reasonForAppealingField, reason.reasonForAppealing);
}

function addAReasonForAppealingAndThenClickAddAnother(
  language,
  whatYouDisagreeWithField,
  reasonForAppealingField,
  reason,
) {
  

  addAReasonForAppealing(page, language, whatYouDisagreeWithField, reasonForAppealingField, reason);
  await page.click('Add reason');
}

function addReasonForAppealingUsingTheOnePageFormAndContinue(page, language, commonContent, reason) {
  

  await page.waitForTimeout(5);
  addAReasonForAppealing(page, 
    language,
    '#items-0 #item\\.whatYouDisagreeWith-0',
    '#items-0 #item\\.reasonForAppealing-0',
    reason,
  );
  await page.click(commonContent.continue);
}

function addReasonForAppealingUsingTheOnePageFormAfterSignIn(language, commonContent, reason) {
  

  addAReasonForAppealing(page, 
    language,
    '#items-0 #item\\.whatYouDisagreeWith-0',
    '#items-0 #item\\.reasonForAppealing-0',
    reason,
  );
  await page.click(commonContent.saveAndContinue);
}

module.exports = {
  hasErrorClass,
  addAReasonForAppealing,
  addAReasonForAppealingAndThenClickAddAnother,
  addReasonForAppealingUsingTheOnePageFormAndContinue,
  addReasonForAppealingUsingTheOnePageFormAfterSignIn,
};
