const mrnDateContent = require('steps/compliance/mrn-date/content.json').en.translation;
const noMRNContent = require('steps/compliance/no-mrn/content.json').en.translation;
const contactDWPContent = require('steps/compliance/contact-dwp/content.json').en.translation;
const urls = require('urls');

Feature('User does not have an MRN');

Before((I) => {
    I.createTheSession();
});

After((I) => {
    I.endTheSession();
});


Scenario('I do not have an MRN, I have not contacted DWP, I should contact DWP', (I) => {

    I.seeCurrentUrlEquals(urls.start.benefitType);
    I.enterBenefitTypeAndContinue('ESA');
    I.seeCurrentUrlEquals(urls.compliance.mrnDate);
    I.click(mrnDateContent.doNotHaveAnMRN);
    I.seeCurrentUrlEquals(urls.compliance.noMRN);
    I.click(noMRNContent.haveNotContactedDWP);
    I.seeCurrentUrlEquals(urls.compliance.contactDWP);
    I.see(contactDWPContent.title);

});

Scenario('I do not have an MRN, I have a reason why, I am on the appointee page', (I) => {

    I.seeCurrentUrlEquals(urls.start.benefitType);
    I.enterBenefitTypeAndContinue('ESA');
    I.seeCurrentUrlEquals(urls.compliance.mrnDate);
    I.click(mrnDateContent.doNotHaveAnMRN);
    I.seeCurrentUrlEquals(urls.compliance.noMRN);
    I.fillField('NoMRN_reasonForNoMRN', 'I do not have an MRN because...');
    I.click('Continue');
    I.seeCurrentUrlEquals(urls.identity.areYouAnAppointee);

});

Scenario('I exit the service after being told I need to contact DWP', (I) => {

    I.amOnPage(urls.compliance.contactDWP);
    I.click('Return to GOV.UK');
    I.amOnPage('https://www.gov.uk');

});
