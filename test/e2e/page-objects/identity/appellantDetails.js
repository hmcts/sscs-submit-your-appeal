const appellant = require('test/e2e/data').appellant;
const config = require('config');
const postcodeLookupEn = require('component/postcodeLookup/content.en.json');
const postcodeLookupCy = require('component/postcodeLookup/content.cy.json');

const postcodeLookupEnabled = config.get('postcodeLookup.enabled') === 'true';

function enterAppellantNameAndContinue(commonContent, title, firstName, lastName) {
  const I = this;

  I.fillField({ id: 'title' }, title);
  I.fillField({ id: 'firstName' }, firstName);
  I.fillField({ id: 'lastName' }, lastName);
  I.click(commonContent.continue);
}

function enterAppellantDOBAndContinue(commonContent, day, month, year) {
  const I = this;

  I.fillField('input[name*="day"]', day);
  I.fillField('input[name*="month"]', month);
  I.fillField('input[name*="year"]', year);
  I.click(commonContent.continue);
}

function enterAppellantNINOAndContinue(commonContent, nino) {
  const I = this;

  I.fillField('#nino', nino);
  I.click(commonContent.continue);
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

function enterAppellantContactDetailsManuallyAndContinue() {
  const I = this;
  IenterAddressDetailsManual(I);
  I.click('Continue');
}

function enterAppellantContactDetailsAndContinue(commonContent, language) {
  const I = this;
  const postcodeLookup = language === 'en' ? postcodeLookupEn : postcodeLookupCy;

  if (postcodeLookupEnabled) {
    I.fillField({ id: 'postcodeLookup' }, 'xxxxx');
    I.click(postcodeLookup.findAddress);
    I.see(postcodeLookup.fields.postcodeLookup.error.required);
    I.fillField({ id: 'postcodeLookup' }, 'n29ed');
    I.click(commonContent.continue);
    I.see(postcodeLookup.fields.postcodeAddress.error.required);
    IenterAddressDetails(I);
  } else {
    IenterAddressDetailsManual(I);
  }
  I.click(commonContent.continue);
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
  enterAppellantContactDetailsWithEmailAndContinue,
  enterAppellantContactDetailsManuallyAndContinue
};
