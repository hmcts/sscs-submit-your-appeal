const config = require('config');

const postcodeLookupEnabled = config.get('postcodeLookup.enabled');

function enterRequiredRepresentativeDetails() {
  const I = this;

  I.fillField('input[name="name.title"]', 'Mr');
  I.fillField('input[name="name.first"]', 'Harry');
  I.fillField('input[name="name.last"]', 'Potter');

  if (postcodeLookupEnabled) {
    I.click({ id: 'manualLink' });
  }

  I.fillField('#addressLine1', '4 Privet Drive');
  I.fillField('#addressLine2', 'Off Wizards close');
  I.fillField('#county', 'Wizard county');
  I.fillField('#townCity', 'Little Whinging');
  I.fillField('#postCode', 'PA80 5UU');
}

module.exports = { enterRequiredRepresentativeDetails };
