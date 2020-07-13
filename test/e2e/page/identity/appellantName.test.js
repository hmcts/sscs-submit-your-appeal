const content = require('commonContent');
const appellantNameContentEn = require('steps/identity/appellant-name/content.en');
const appellantNameContentCy = require('steps/identity/appellant-name/content.cy');
const paths = require('paths');

const languages = ['en', 'cy'];

Feature('Appellant Name form @batch-09');

languages.forEach(language => {
  const commonContent = content[language];
  const appellantNameContent = language === 'en' ? appellantNameContentEn : appellantNameContentCy;

  Before(I => {
    I.createTheSession(language);
    I.amOnPage(paths.identity.enterAppellantName);
  });

  After(I => {
    I.endTheSession();
  });

  Scenario(`${language.toUpperCase()} - When I fill in the fields and click Continue, I am taken to /enter-appellant-dob`, I => {
    I.fillField('title', 'Mr');
    I.fillField('firstName', 'Harry');
    I.fillField('lastName', 'Potter');
    I.click(commonContent.continue);
    I.seeCurrentUrlEquals(paths.identity.enterAppellantDOB);
  });

  Scenario(`${language.toUpperCase()} - When I only provide a single character for firstName and lastName I see errors`, I => {
    I.fillField('#firstName', 'H');
    I.fillField('#lastName', 'P');
    I.click(commonContent.continue);
    I.see(appellantNameContent.fields.firstName.error.invalid);
    I.see(appellantNameContent.fields.lastName.error.invalid);
  });

  Scenario(`${language.toUpperCase()} - When I click Continue without filling in the fields I see errors`, I => {
    I.click(commonContent.continue);
    I.see(appellantNameContent.fields.title.error.required);
    I.see(appellantNameContent.fields.firstName.error.required);
    I.see(appellantNameContent.fields.lastName.error.required);
  });
});
