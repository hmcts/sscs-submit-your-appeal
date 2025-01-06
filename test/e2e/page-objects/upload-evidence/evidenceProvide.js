const evidenceUploadContentEn = require('steps/reasons-for-appealing/evidence-provide/content.en');
const evidenceUploadContentCy = require('steps/reasons-for-appealing/evidence-provide/content.cy');


function selectAreYouProvidingEvidenceAndContinue(language, commonContent, option) {
  const I = this;
  const evidenceUploadContent = language === 'en' ? evidenceUploadContentEn : evidenceUploadContentCy;

  I.waitForText(evidenceUploadContent.title);
  I.checkOption(option);
  I.scrollPageToBottom();
  I.click(commonContent.continue);
}

function selectAreYouProvidingEvidenceAfterSignIn(language, commonContent, option) {
  const I = this;
  const evidenceUploadContent = language === 'en' ? evidenceUploadContentEn : evidenceUploadContentCy;

  I.waitForText(evidenceUploadContent.title);
  I.checkOption(option);
  I.scrollPageToBottom();
  I.click(commonContent.saveAndContinue);
}

module.exports = { selectAreYouProvidingEvidenceAndContinue, selectAreYouProvidingEvidenceAfterSignIn };
