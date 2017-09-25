const content = require('steps/identity/appointee/content').en.translation.content;
const errors = require('steps/identity/appellant-details/content').en.translation.errors;

Feature('Appellant details form');

Scenario('User selects NO and completes the form', (I) => {

    I.selectAreYouAnAppointeeAndContinue(content.no);
    I.seeCurrentUrlEquals('/enter-appellant-details');
    I.fillField('firstName', 'Harry');
    I.fillField('lastNames', 'Potter');
    I.fillField('nationalInsuranceNumber', ' AB123456C');
    I.fillField('addressLine1', '4 Privet Drive');
    I.fillField('addressLine2', 'Off Wizards close');
    I.fillField('townCity', 'Little Whinging');
    I.fillField('postcode', 'WZ15 1AB');
    I.fillField('phoneNumber', '07466748336');
    I.fillField('emailAddress', 'harrypotter@wizards.com');
    I.click('Continue');
    I.seeCurrentUrlEquals('/appellant-sms-notifications');

});

Scenario('User selects NO and does not complete the form', (I) => {

    I.selectAreYouAnAppointeeAndContinue(content.no);
    I.seeCurrentUrlEquals('/enter-appellant-details');
    I.click('Continue');
    I.see(errors.firstName.required);
    I.see(errors.lastNames.required);
    I.see(errors.nationalInsuranceNumber.required);
    I.see(errors.addressLine1.required);
    I.see(errors.townCity.required);
    I.see(errors.postcode.required);

});

Scenario('User selects YES and views a placeholder', (I) => {

    I.selectAreYouAnAppointeeAndContinue(content.yes);
    I.seeCurrentUrlEquals('/enter-appointee-details');

});
