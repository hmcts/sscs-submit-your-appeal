const appellantDOB = require('steps/identity/appellant-dob/content.en').fields;
const paths = require('paths');

Feature('Appellant DOB form @batch-09');

Before(I => {
  I.createTheSession();
  I.amOnPage(paths.identity.enterAppellantDOB);
});

After(I => {
  I.endTheSession();
});

Scenario('When I complete the form and click Continue, I am taken to /enter-appellant-nino', I => {
  I.enterAppellantDOBAndContinue('21', '03', '1981');
  I.seeCurrentUrlEquals(paths.identity.enterAppellantNINO);
});

Scenario('When I click Continue without filling in the fields I see errors', I => {
  I.click('Continue');
  I.see(appellantDOB.date.error.allRequired);
});

Scenario('When I click Continue when only entering the day field I see errors', I => {
  I.fillField('input[name*="day"]', '21');
  I.click('Continue');
  I.see(appellantDOB.date.error.monthRequired);
  I.see(appellantDOB.date.error.yearRequired);
});

Scenario('When I click Continue when only entering the month field I see errors', I => {
  I.fillField('input[name*="month"]', '12');
  I.click('Continue');
  I.see(appellantDOB.date.error.yearRequired);
  I.see(appellantDOB.date.error.dayRequired);
});

Scenario('When I click Continue when only entering the year field I see errors', I => {
  I.fillField('input[name*="year"]', '1999');
  I.click('Continue');
  I.see(appellantDOB.date.error.monthRequired);
  I.see(appellantDOB.date.error.dayRequired);
});

Scenario('When I enter an invalid date I see errors', I => {
  I.enterAppellantDOBAndContinue('30', '02', '1981');
  I.see(appellantDOB.date.error.invalid);
});

Scenario('When I enter a date in the future I see errors', I => {
  I.enterAppellantDOBAndContinue('25', '02', '3400');
  I.see(appellantDOB.date.error.future);
});

Scenario('I enter a dob with name of month', I => {
  I.enterAppellantDOBAndContinue('21', 'March', '1981');
  I.seeCurrentUrlEquals(paths.identity.enterAppellantNINO);
});

Scenario('I enter a dob with the short name of month', I => {
  I.enterAppellantDOBAndContinue('21', 'Jul', '1981');
  I.seeCurrentUrlEquals(paths.identity.enterAppellantNINO);
});


Scenario('I enter a dob with an invalid name of month', I => {
  I.enterAppellantDOBAndContinue('21', 'invalidMonth', '1981');
  I.see(appellantDOB.date.error.invalid);
});
