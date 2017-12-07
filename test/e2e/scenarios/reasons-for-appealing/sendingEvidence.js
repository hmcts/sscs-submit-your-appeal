'use strict';

const paths = require('paths');
const content = require('steps/reasons-for-appealing/sending-evidence/content.en.json');

Feature('Sending Evidence');

Before((I) => {
    I.createTheSession();
});

After((I) => {
    I.endTheSession();
});

Scenario('When I omit my email address from my contact details I should see the correct content on /sending-evidence', (I) => {

    I.amOnPage(paths.identity.enterAppellantContactDetails);
    I.enterAppellantContactDetailsAndContinue();
    I.amOnPage(paths.reasonsForAppealing.sendingEvidence);
    I.see(content.postEvidence);

});

Scenario('When I add my email address to my contact details I should see the correct content on /sending-evidence', (I) => {

    I.amOnPage(paths.identity.enterAppellantContactDetails);
    I.enterAppellantContactDetailsWithEmailAndContinue();
    I.amOnPage(paths.reasonsForAppealing.sendingEvidence);
    I.see(content.postEvidenceWithEmail);

});

Scenario('When I go to the /sending-evidence page I see the title', (I) => {

    I.amOnPage(paths.reasonsForAppealing.sendingEvidence);
    I.see(content.title);

});

Scenario('When I go to the /sending-evidence page and select continue I see the path /the-hearing', (I) => {

    I.amOnPage(paths.reasonsForAppealing.sendingEvidence);
    I.click('Continue');
    I.seeInCurrentUrl(paths.hearing.theHearing);

});
