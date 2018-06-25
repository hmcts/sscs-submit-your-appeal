const paths = require('paths');
const content = require('steps/reasons-for-appealing/sending-evidence/content.en.json');

Feature('Sending Evidence - appellant contact details');

Before(I => {
  I.createTheSession();
  I.amOnPage(paths.identity.enterAppellantContactDetails);
});
