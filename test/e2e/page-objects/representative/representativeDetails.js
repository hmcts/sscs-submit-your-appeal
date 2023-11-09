const config = require('config');

const postcodeLookupEnabled = config.get('postcodeLookup.enabled') === 'true';

function enterRequiredRepresentativeDetailsManual(I) {
  I.fillField('input[name="name.title"]', 'Mr');
  I.fillField('input[name="name.first"]', 'Harry');
  I.fillField('input[name="name.last"]', 'Potter');

  I.click({ id: 'manualLink' });

  I.fillField('#addressLine1', '4 Privet Drive');
  I.fillField('#addressLine2', 'Off Wizards close');
  I.fillField('#county', 'Wizard county');
  I.fillField('#townCity', 'Little Whinging');
  I.fillField('#postCode', 'PA80 5UU');
}

function enterRequiredRepresentativeDetails(I) {
  if (postcodeLookupEnabled) {
    I.fillField('input[name="name.title"]', 'Mr');
    I.fillField('input[name="name.first"]', 'Harry');
    I.fillField('input[name="name.last"]', 'Potter');
    I.fillField({ id: 'postcodeLookup' }, 'PA80 5UU');
    I.click('Find address');
    I.selectOption({ css: 'form select[name=postcodeAddress]' }, '130075116');
  } else {
    enterRequiredRepresentativeDetailsManual(I);
  }
}

module.exports = { enterRequiredRepresentativeDetails };
