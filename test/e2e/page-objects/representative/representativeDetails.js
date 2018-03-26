'use strict';

function enterRequiredRepresentativeDetails() {

    const I = this;

    I.fillField('input[name="nameOrganisation.firstName"]', 'Harry');
    I.fillField('input[name="nameOrganisation.lastName"]', 'Potter');
    I.fillField('#addressLine1', '4 Privet Drive');
    I.fillField('#addressLine2', 'Off Wizards close');
    I.fillField('#county', 'Wizard county');
    I.fillField('#townCity', 'Little Whinging');
    I.fillField('#postCode', 'PA80 5UU');

}

module.exports = { enterRequiredRepresentativeDetails };
