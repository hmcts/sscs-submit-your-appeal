const language = 'en';
const commonContent = require('commonContent')[language];
const appellantDOBContent = require(`steps/identity/appellant-dob/content.${language}`);
const paths = require('paths');

Feature(`${language.toUpperCase()} - Appellant DOB form @batch-09`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.identity.enterAppellantDOB);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - When I complete the form and click Continue, I am taken to /enter-appellant-nino`, ({ I }) => {
  I.enterAppellantDOBAndContinue('21', '03', '1981');
  I.seeCurrentUrlEquals(paths.identity.enterAppellantNINO);
});

Scenario(`${language.toUpperCase()} - When I click Continue without filling in the fields I see errors`, ({ I }) => {
  I.click(commonContent.continue);
  I.see(appellantDOBContent.fields.date.error.allRequired);
});

Scenario(`${language.toUpperCase()} - When I click Continue when only entering the day field I see errors`, ({ I }) => {
  I.fillField('input[name*="day"]', '21');
  I.click(commonContent.continue);
  I.see(appellantDOBContent.fields.date.error.monthRequired);
  I.see(appellantDOBContent.fields.date.error.yearRequired);
});

Scenario(`${language.toUpperCase()} - When I click Continue when only entering the month field I see errors`, ({ I }) => {
  I.fillField('input[name*="month"]', '12');
  I.click(commonContent.continue);
  I.see(appellantDOBContent.fields.date.error.yearRequired);
  I.see(appellantDOBContent.fields.date.error.dayRequired);
});

Scenario(`${language.toUpperCase()} - When I click Continue when only entering the year field I see errors`, ({ I }) => {
  I.fillField('input[name*="year"]', '1999');
  I.click(commonContent.continue);
  I.see(appellantDOBContent.fields.date.error.monthRequired);
  I.see(appellantDOBContent.fields.date.error.dayRequired);
});

Scenario(`${language.toUpperCase()} - When I enter an invalid date I see errors`, ({ I }) => {
  I.enterAppellantDOBAndContinue('30', '02', '1981');
  I.see(appellantDOBContent.fields.date.error.invalid);
});

Scenario(`${language.toUpperCase()} - When I enter a date in the future I see errors`, ({ I }) => {
  I.enterAppellantDOBAndContinue('25', '02', '3400');
  I.see(appellantDOBContent.fields.date.error.future);
});

Scenario(`${language.toUpperCase()} - I enter a dob with name of month`, ({ I }) => {
  I.enterAppellantDOBAndContinue('21', 'March', '1981');
  I.seeCurrentUrlEquals(paths.identity.enterAppellantNINO);
});

Scenario(`${language.toUpperCase()} - I enter a dob with the short name of month`, ({ I }) => {
  I.enterAppellantDOBAndContinue('21', 'Jul', '1981');
  I.seeCurrentUrlEquals(paths.identity.enterAppellantNINO);
});

Scenario(`${language.toUpperCase()} - I enter a dob with an invalid name of month`, ({ I }) => {
  I.enterAppellantDOBAndContinue('21', 'invalidMonth', '1981');
  I.see(appellantDOBContent.fields.date.error.invalid);
});
