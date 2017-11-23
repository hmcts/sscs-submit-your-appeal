'use strict';

function enterRequiredAppellantContactDetails() {

    const I = this;

    I.fillField('#addressLine1', '4 Privet Drive');
    I.fillField('#addressLine2', 'Off Wizards close');
    I.fillField('#townCity', 'Little Whinging');
    I.fillField('#postCode', 'PA80 5UU');

}

function enterAppellantDetailsWithMobileAndContinue() {

    const I = this;

    I.enterRequiredAppellantContactDetails();
    I.fillField('#phoneNumber', '07466748336');
    I.click('Continue');
}

module.exports = { enterRequiredAppellantContactDetails, enterAppellantDetailsWithMobileAndContinue };
