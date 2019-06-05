const appellant = require('test/e2e/data').appellant;
const config = require('config');

const postcodeLookupEnabled = config.get('postcodeLookup.enabled') === 'true';

function enterAppellantNameAndContinue(title, firstName, lastName) {
  const I = this;

  I.fillField({ id: 'title' }, title);
  I.fillField({ id: 'firstName' }, firstName);
  I.fillField({ id: 'lastName' }, lastName);
  I.click('Continue');
}

function enterAppellantDOBAndContinue(day, month, year) {
  const I = this;

  I.fillField('.form-group-day input', day);
  I.fillField('.form-group-month input', month);
  I.fillField('.form-group-year input', year);
  I.click('Continue');
}

function enterAppellantNINOAndContinue(nino) {
  const I = this;

  I.fillField('#nino', nino);
  I.click('Continue');
}

function IenterAddressDetailsManual(I) {
  if (postcodeLookupEnabled) {
    I.click({ id: 'manualLink' });
  }
  I.fillField({ id: 'addressLine1' }, appellant.contactDetails.addressLine1);
  I.fillField({ id: 'addressLine2' }, appellant.contactDetails.addressLine2);
  I.fillField({ id: 'townCity' }, appellant.contactDetails.townCity);
  I.fillField({ id: 'county' }, appellant.contactDetails.county);
  I.fillField({ id: 'postCode' }, appellant.contactDetails.postCode);
}

function IenterAddressDetails(I) {
  if (postcodeLookupEnabled) {
    I.fillField({ id: 'postcodeLookup' }, appellant.contactDetails.postCode);
    I.click('Find address');
    I.selectOption({ css: 'form select[name=postcodeAddress]' },
      appellant.contactDetails.postcodeAddress);
  } else {
    IenterAddressDetailsManual(I);
  }
}


function enterAppellantContactDetailsAndContinue() {
  const I = this;
  IenterAddressDetails(I);
  I.click('Continue');
}

function enterAppellantContactDetailsWithMobileAndContinue(mobileNumber = '07466748336') {
  const I = this;

  IenterAddressDetails(I);
  I.fillField('#phoneNumber', mobileNumber);
  I.click('Continue');
}

function enterAppellantContactDetailsWithEmailAndContinue() {
  const I = this;

  IenterAddressDetails(I);
  I.fillField('#emailAddress', 'harry.potter@wizards.com');
  I.click('Continue');
}

module.exports = {
  enterAppellantNameAndContinue,
  enterAppellantDOBAndContinue,
  enterAppellantNINOAndContinue,
  enterAppellantContactDetailsAndContinue,
  enterAppellantContactDetailsWithMobileAndContinue,
  enterAppellantContactDetailsWithEmailAndContinue
};
