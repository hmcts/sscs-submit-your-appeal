const assert = require('assert');
const reasonForAppealingContentEn = require('steps/reasons-for-appealing/reason-for-appealing/content.en');
const reasonForAppealingContentCy = require('steps/reasons-for-appealing/reason-for-appealing/content.cy');

async function hasErrorClass(item) {
  const I = this;

  const classes = await I.grabAttributeFrom(`${item} div`, 'class');
  const hasClass = classes.includes('govuk-form-group--error');
  assert.equal(hasClass, true);
}

function addAReasonForAppealing(language, whatYouDisagreeWithField, reasonForAppealingField, reason) {
  const I = this;
  const reasonForAppealingContent = language === 'en' ? reasonForAppealingContentEn : reasonForAppealingContentCy;

  I.waitForText(reasonForAppealingContent.title);
  I.waitForElement(whatYouDisagreeWithField, 5);
  I.fillField(whatYouDisagreeWithField, reason.whatYouDisagreeWith);
  I.fillField(reasonForAppealingField, reason.reasonForAppealing);
}

function addAReasonForAppealingAndThenClickAddAnother(language, whatYouDisagreeWithField,
  reasonForAppealingField, reason) {
  const I = this;

  I.addAReasonForAppealing(language, whatYouDisagreeWithField, reasonForAppealingField, reason);
  I.click('Add reason');
}

function addReasonForAppealingUsingTheOnePageFormAndContinue(language, commonContent, reason) {
  const I = this;

  I.wait(5);
  I.addAReasonForAppealing(
    language,
    '#items-0 #item\\.whatYouDisagreeWith-0',
    '#items-0 #item\\.reasonForAppealing-0',
    reason
  );
  I.click(commonContent.continue);
}

function addReasonForAppealingUsingTheOnePageFormAfterSignIn(language, commonContent, reason) {
  const I = this;

  I.addAReasonForAppealing(
    language,
    '#items-0 #item\\.whatYouDisagreeWith-0',
    '#items-0 #item\\.reasonForAppealing-0',
    reason
  );
  I.click(commonContent.saveAndContinue);
}

module.exports = {
  hasErrorClass,
  addAReasonForAppealing,
  addAReasonForAppealingAndThenClickAddAnother,
  addReasonForAppealingUsingTheOnePageFormAndContinue,
  addReasonForAppealingUsingTheOnePageFormAfterSignIn
};
