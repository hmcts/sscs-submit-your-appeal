const mrnDateContent = require('steps/compliance/mrn-date/content.json').en.translation.content;
const noMRNContent = require('steps/compliance/no-mrn/content.json').en.translation.content;
const contactDWPContent = require('steps/compliance/contact-dwp/content.json').en.translation.content;
// const common = require('content/common.json').en.translation;

Feature('User does not have an MRN');

Scenario('I do not have an MRN, I have not contacted DWP, I should contact DWP', (I) => {

    I.enterBenefitTypeAndContinue('ESA');
    I.seeCurrentUrlEquals('/mrn-date');
    I.click(mrnDateContent.doNotHaveAnMRN);
    I.seeCurrentUrlEquals('/no-mrn');
    I.click(noMRNContent.haveNotContactedDWP);
    I.seeCurrentUrlEquals('/contact-dwp');
    I.see(contactDWPContent.title);
});

Scenario('I do not have an MRN, I have a reason why, I am on the appointee page', (I) => {

    I.enterBenefitTypeAndContinue('ESA');
    I.seeCurrentUrlEquals('/mrn-date');
    I.click(mrnDateContent.doNotHaveAnMRN);
    I.seeCurrentUrlEquals('/no-mrn');
    I.fillField('reasonForNoMRN', 'I do not have an MRN because...');
    I.click('Continue');
    I.seeCurrentUrlEquals('/appointee');

});

Scenario('I exit the service after being told I need to contact DWP', (I) => {

    I.amOnPage('/contact-dwp');
    I.click(common.exitService);
    I.amOnPage('https://www.gov.uk');

});
