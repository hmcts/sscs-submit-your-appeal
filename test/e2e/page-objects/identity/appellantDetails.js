'use strict';

function enterAppellantNameAndContinue(title, firstName, lastName) {

    const I = this;

    I.fillField('#title', title);
    I.fillField('#firstName', firstName);
    I.fillField('#lastName', lastName);
    I.click('Continue');

}

function enterAppellantDOBAndContinue(day, month, year) {

    const I = this;

    I.fillField('#day', day);
    I.fillField('#month', month);
    I.fillField('#year', year);
    I.click('Continue');
}

function enterAppellantNINOAndContinue(nino) {

    const I = this;

    I.fillField('#nino', nino);
    I.click('Continue');
}

function enterAppellantContactDetailsAndContinue() {

    const I = this;

    I.fillField('#addressLine1', '4 Privet Drive');
    I.fillField('#addressLine2', 'Off Wizards close');
    I.fillField('#townCity', 'Little Whinging');
    I.fillField('#county', 'Kent');
    I.fillField('#postCode', 'PA80 5UU');
    I.click('Continue');

}

function enterAppellantContactDetailsWithMobileAndContinue(mobileNumber='07466748336') {

    const I = this;

    I.fillField('#addressLine1', '4 Privet Drive');
    I.fillField('#addressLine2', 'Off Wizards close');
    I.fillField('#townCity', 'Little Whinging');
    I.fillField('#county', 'Kent');
    I.fillField('#postCode', 'PA80 5UU');
    I.fillField('#phoneNumber', mobileNumber);
    I.click('Continue');
}

module.exports = {
    enterAppellantNameAndContinue,
    enterAppellantDOBAndContinue,
    enterAppellantNINOAndContinue,
    enterAppellantContactDetailsAndContinue,
    enterAppellantContactDetailsWithMobileAndContinue
};
