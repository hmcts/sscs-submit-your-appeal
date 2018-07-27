const paths = require('paths');
const content = require('steps/reasons-for-appealing/sending-evidence/content.en.json');

const evidenceUploadEnabled = require('config').get('features.evidenceUpload.enabled');

Feature('Sending Evidence - appellant contact details @evidence-upload @batch-10');

/* eslint-disable max-len */
if (!evidenceUploadEnabled) {
  Before(I => {
    I.createTheSession();
    I.amOnPage(paths.identity.enterAppellantContactDetails);
  });

  After(I => {
    I.endTheSession();
  });

  Scenario('When I omit my email address I see the correct content on /sending-evidence', I => {
    I.enterAppellantContactDetailsAndContinue();
    I.amOnPage(paths.reasonsForAppealing.sendingEvidence);
    I.see(content.postEvidence);
  });

  Scenario('When I add my email address I should see the correct content on /sending-evidence', I => {
    I.enterAppellantContactDetailsWithEmailAndContinue();
    I.amOnPage(paths.reasonsForAppealing.sendingEvidence);
    I.see(content.postEvidenceWithEmail);
  });

  Scenario('When I go to the /sending-evidence page I see the title', I => {
    I.enterAppellantContactDetailsAndContinue();
    I.amOnPage(paths.reasonsForAppealing.sendingEvidence);
    I.see(content.title);
  });

  Scenario('When clicking continue I see the correct path', I => {
    I.enterAppellantContactDetailsAndContinue();
    I.amOnPage(paths.reasonsForAppealing.sendingEvidence);
    I.click('Continue');
    I.seeInCurrentUrl(paths.hearing.theHearing);
  });
}
