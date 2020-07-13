const content = require('commonContent');
const mrnOverAMonthLateContentEn = require('steps/compliance/mrn-over-month-late/content.en');
const mrnOverAMonthLateContentCy = require('steps/compliance/mrn-over-month-late/content.cy');
const paths = require('paths');

const languages = ['en', 'cy'];

Feature('MRN Over one month late @batch-07');

languages.forEach(language => {
  const commonContent = content[language];
  const mrnOverAMonthLateContent = language === 'en' ? mrnOverAMonthLateContentEn : mrnOverAMonthLateContentCy;

  Before(I => {
    I.createTheSession(language);
    I.amOnPage(paths.compliance.mrnOverMonthLate);
  });

  After(I => {
    I.endTheSession();
  });

  Scenario(`${language.toUpperCase()} - I enter a lateness reason, I click continue, I am taken to /enter-appellant-name`, I => {
    I.fillField('#reasonForBeingLate', 'Reason for being late');
    I.click(commonContent.continue);
    I.seeInCurrentUrl(paths.identity.enterAppellantName);
  });

  Scenario('MRN is over one month late, I do not enter a reason, I see errors', I => {
    I.click(commonContent.continue);
    I.seeCurrentUrlEquals(paths.compliance.mrnOverMonthLate);
    I.see(mrnOverAMonthLateContent.fields.reasonForBeingLate.error.required);
  });

  Scenario(`${language.toUpperCase()} - I enter a reason why my appeal is late, it is less than five chars, I see errors`, I => {
    I.fillField('#reasonForBeingLate', 'n/a');
    I.click(commonContent.continue);
    I.seeCurrentUrlEquals(paths.compliance.mrnOverMonthLate);
    I.see(mrnOverAMonthLateContent.fields.reasonForBeingLate.error.notEnough);
  });

  Scenario(`${language.toUpperCase()} - I enter a reason why my appeal is late with a special character, I see errors`, I => {
    I.fillField('#reasonForBeingLate', '<Reason for being late>');
    I.click(commonContent.continue);
    I.seeCurrentUrlEquals(paths.compliance.mrnOverMonthLate);
    I.see(mrnOverAMonthLateContent.fields.reasonForBeingLate.error.invalid);
  });
});
