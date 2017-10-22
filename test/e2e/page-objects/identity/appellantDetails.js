'use strict';

function enterRequiredAppellantDetails() {

    const I = this;

    I.fillField('#AppellantDetails_firstName', 'Harry');
    I.fillField('#AppellantDetails_lastName', 'Potter');
    I.fillField('#AppellantDetails_niNumber', 'AB123456C');
    I.fillField('#AppellantDetails_addressLine1', '4 Privet Drive');
    I.fillField('#AppellantDetails_addressLine2', 'Off Wizards close');
    I.fillField('#AppellantDetails_townCity', 'Little Whinging');
    I.fillField('#AppellantDetails_postCode', 'PA80 5UU');

}

function enterAppellantDetailsWithMobileAndContinue() {

    const I = this;

    I.enterRequiredAppellantDetails();
    I.fillField('#AppellantDetails_appellantPhoneNumber', '07466748336');
    I.click('Continue');
}

module.exports = { enterRequiredAppellantDetails, enterAppellantDetailsWithMobileAndContinue };
