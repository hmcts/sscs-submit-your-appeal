const language = 'cy';
const commonContent = require('commonContent')[language];
const mrnOverThirteenMonthsLateContent = require(`steps/compliance/mrn-over-thirteen-months-late/content.${language}`);
const paths = require('paths');

Feature(`${language.toUpperCase()} - MRN Over thirteen months late @batch-07`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.compliance.mrnOverThirteenMonthsLate);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - I enter a lateness reason, I click continue, I am taken to /enter-appellant-name`, ({ I }) => {
  I.fillField('#reasonForBeingLate', 'Reason for being late');
  I.click(commonContent.continue);
  I.seeInCurrentUrl(paths.identity.enterAppellantName);
});

Scenario(`${language.toUpperCase()} - MRN is over 13 months late, I omit a reason why my appeal is late, I see errors`, ({ I }) => {
  I.click(commonContent.continue);
  I.seeCurrentUrlEquals(paths.compliance.mrnOverThirteenMonthsLate);
  I.see(mrnOverThirteenMonthsLateContent.fields.reasonForBeingLate.error.required);
});

Scenario(`${language.toUpperCase()} - I enter a reason why my appeal is late, it is less than five chars, I see errors`, ({ I }) => {
  I.fillField('#reasonForBeingLate', 'n/a');
  I.click(commonContent.continue);
  I.seeCurrentUrlEquals(paths.compliance.mrnOverThirteenMonthsLate);
  I.see(mrnOverThirteenMonthsLateContent.fields.reasonForBeingLate.error.notEnough);
});

Scenario(`${language.toUpperCase()} - I enter a reason why my appeal is late with a special character, I see errors`, ({ I }) => {
  I.fillField('#reasonForBeingLate', '<Reason for being late>');
  I.click(commonContent.continue);
  I.seeCurrentUrlEquals(paths.compliance.mrnOverThirteenMonthsLate);
  I.see(mrnOverThirteenMonthsLateContent.fields.reasonForBeingLate.error.invalid);
});
