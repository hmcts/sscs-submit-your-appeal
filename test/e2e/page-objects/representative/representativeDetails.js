'use strict';

function enterRequiredRepresentativeDetails() {

    const I = this;

    I.fillField('#RepresentativeDetails_firstName', 'Harry');
    I.fillField('#RepresentativeDetails_lastName', 'Potter');
    I.fillField('#RepresentativeDetails_addressLine1', '4 Privet Drive');
    I.fillField('#RepresentativeDetails_addressLine2', 'Off Wizards close');
    I.fillField('#RepresentativeDetails_county', 'Wizard county');
    I.fillField('#RepresentativeDetails_townCity', 'Little Whinging');
    I.fillField('#RepresentativeDetails_postCode', 'PA80 5UU');

}

module.exports = { enterRequiredRepresentativeDetails };
