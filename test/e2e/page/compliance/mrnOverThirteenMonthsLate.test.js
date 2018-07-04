const paths = require('paths');
const content = require('steps/compliance/mrn-over-thirteen-months-late/content.en.json');

Feature('MRN Over thirteen months late @batch-07');

Before(I => {
  I.createTheSession();
  I.amOnPage(paths.compliance.mrnOverThirteenMonthsLate);
});

After(I => {
  I.endTheSession();
});

Scenario('I enter a lateness reason, I click continue, I am taken to /enter-appellant-name', I => {
  I.fillField('#reasonForBeingLate', 'Reason for being late');
  I.click('Continue');
  I.seeInCurrentUrl(paths.identity.enterAppellantName);
});

Scenario('MRN is over 13 months late, I omit a reason why my appeal is late, I see errors', I => {
  I.click('Continue');
  I.seeCurrentUrlEquals(paths.compliance.mrnOverThirteenMonthsLate);
  I.see(content.fields.reasonForBeingLate.error.required);
});

Scenario('I enter a reason why my appeal is late, it is less than five chars, I see errors', I => {
  I.fillField('#reasonForBeingLate', 'n/a');
  I.click('Continue');
  I.seeCurrentUrlEquals(paths.compliance.mrnOverThirteenMonthsLate);
  I.see(content.fields.reasonForBeingLate.error.notEnough);
});

Scenario('I enter a reason why my appeal is late with a special character, I see errors', I => {
  I.fillField('#reasonForBeingLate', '<Reason for being late>');
  I.click('Continue');
  I.seeCurrentUrlEquals(paths.compliance.mrnOverThirteenMonthsLate);
  I.see(content.fields.reasonForBeingLate.error.invalid);
});
