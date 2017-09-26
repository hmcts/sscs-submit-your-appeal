const appointee = require('steps/identity/appointee/content.json').en.translation;
const appellant_details = require('steps/identity/appellant-details/content.json').en.translation;

Feature('Appellant details form');

Before((I) => {
      I.amOnPage('');
  })

Scenario('User selects NO and completes the form', (I) => {

    I.selectAreYouAnAppointeeAndContinue(appointee.fields.isappointee.no);
    I.seeCurrentUrlEquals('/enter-appellant-details');
    I.fillField({id: 'AppellantDetails_firstName'}, 'Harry');
    I.fillField({id: 'AppellantDetails_lastName'}, 'Potter');
    I.fillField({id: 'AppellantDetails_niNumber'}, 'AB123456C');
    I.fillField({id: 'AppellantDetails_addressLine1'}, '4 Privet Drive');
    I.fillField({id: 'AppellantDetails_addressLine2'}, 'Off Wizards close');
    I.fillField({id: 'AppellantDetails_townCity'}, 'Little Whinging');
    I.fillField({id: 'AppellantDetails_postCode'}, 'PA80 5UU');
    I.fillField({id: 'AppellantDetails_phoneNumber'}, '07466748336');
    I.fillField({id: 'AppellantDetails_emailAddress'}, 'harrypotter@wizards.com');
    I.click('Continue');
    I.seeCurrentUrlEquals('/appellant-text-reminders');

});

Scenario('User selects NO and does not complete the form', (I) => {

    I.selectAreYouAnAppointeeAndContinue(appointee.fields.isappointee.no);
    I.seeCurrentUrlEquals('/enter-appellant-details');
    I.click('Continue');
    I.see(appellant_details.fields.firstName.error.msg);
    I.see(appellant_details.fields.lastName.error.msg);
    I.see(appellant_details.fields.niNumber.error.msg);
    I.see(appellant_details.fields.addressLine1.error.msg);
    I.see(appellant_details.fields.townCity.error.msg);
    I.see(appellant_details.fields.postCode.error.msg);

});

Scenario('User selects YES and views a placeholder', (I) => {

    I.selectAreYouAnAppointeeAndContinue(appointee.fields.isappointee.yes);
    I.seeCurrentUrlEquals('/enter-appointee-details');

});
