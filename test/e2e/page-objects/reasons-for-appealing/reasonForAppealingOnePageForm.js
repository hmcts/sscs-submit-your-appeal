const assert = require('assert');

async function hasErrorClass(item) {
  const I = this;

  const classes = await I.grabAttributeFrom(`${item} div`, 'class');
  const hasClass = classes.includes('govuk-form-group--error');
  assert.equal(hasClass, true);
}

function addAReasonForAppealing(whatYouDisagreeWithField, reasonForAppealingField, reason) {
  const I = this;

  I.waitForElement(whatYouDisagreeWithField, 5);
  I.fillField(whatYouDisagreeWithField, reason.whatYouDisagreeWith);
  I.fillField(reasonForAppealingField, reason.reasonForAppealing);
}

function addAReasonForAppealingAndThenClickAddAnother(whatYouDisagreeWithField,
  reasonForAppealingField, reason) {
  const I = this;

  I.addAReasonForAppealing(whatYouDisagreeWithField, reasonForAppealingField, reason);
  I.click('Add reason');
}

function addReasonForAppealingUsingTheOnePageFormAndContinue(commonContent, reason) {
  const I = this;

  I.wait(10);
  I.addAReasonForAppealing(
    '#items-0 #item\\.whatYouDisagreeWith-0',
    '#items-0 #item\\.reasonForAppealing-0',
    reason
  );
  I.click(commonContent.continue);
}

module.exports = {
  hasErrorClass,
  addAReasonForAppealing,
  addAReasonForAppealingAndThenClickAddAnother,
  addReasonForAppealingUsingTheOnePageFormAndContinue
};
