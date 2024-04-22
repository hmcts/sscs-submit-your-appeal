const otherReasonForAppealingContentEn = require('steps/reasons-for-appealing/other-reasons-for-appealing/content.en');
const otherReasonForAppealingContentCy = require('steps/reasons-for-appealing/other-reasons-for-appealing/content.cy');


function enterAnythingElseAndContinue(language, commonContent, anythingElse) {
  const I = this;
  const otherReasonForAppealingContent = language === 'en' ? otherReasonForAppealingContentEn : otherReasonForAppealingContentCy;

  I.waitForText(otherReasonForAppealingContent.title);
  I.fillField('#otherReasonForAppealing', anythingElse);
  I.click(commonContent.continue);
}

function enterAnythingElseAfterSignIn(language, commonContent, anythingElse) {
  const I = this;
  const otherReasonForAppealingContent = language === 'en' ? otherReasonForAppealingContentEn : otherReasonForAppealingContentCy;

  I.waitForText(otherReasonForAppealingContent.title);
  I.fillField('#otherReasonForAppealing', anythingElse);
  I.click(commonContent.saveAndContinue);
}

function enterReasonForAppealAndContinue(commonContent, reason, link) {
  const I = this;

  I.click(link);
  I.fillField('input[name="item.whatYouDisagreeWith"]', reason.whatYouDisagreeWith);
  I.fillField('textarea[name="item.reasonForAppealing"]', reason.reasonForAppealing);
  I.click(commonContent.continue);
}

function addReasonsForAppealingAndContinue(commonContent, reason, link) {
  const I = this;

  I.enterReasonForAppealAndContinue(commonContent, reason, link);
  I.click(commonContent.continue);
}

module.exports = {
  enterAnythingElseAndContinue,
  enterAnythingElseAfterSignIn,
  enterReasonForAppealAndContinue,
  addReasonsForAppealingAndContinue
};
