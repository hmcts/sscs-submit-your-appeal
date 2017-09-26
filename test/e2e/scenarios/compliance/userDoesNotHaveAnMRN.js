const mrnDateContent = require('steps/compliance/mrn-date/content.json').en.translation;
const noMRNContent = require('steps/compliance/no-mrn/content.json').en.translation;
const contactDWPContent = require('steps/compliance/contact-dwp/content.json').en.translation;

Feature('User does not have an MRN');

Before((I) => {
    I.amOnPage('');
})

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
    I.fillField({id : 'NoMRN_reasonForNoMRN'}, 'I do not have an MRN because...');
    I.click('Continue');
    I.seeCurrentUrlEquals('/are-you-an-appointee');
});

Scenario('I exit the service after being told I need to contact DWP', (I) => {

    I.amOnPage('/contact-dwp');
    I.click('Return to GOV.UK');
    I.amOnPage('https://www.gov.uk');

});
