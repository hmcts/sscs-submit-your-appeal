'use strict';

const content = require('steps/compliance/contact-dwp/content.en.json');
const paths = require('paths');

Feature('Contact DWP');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.compliance.contactDWP)
});

After((I) => {
    I.endTheSession();
});

Scenario('I exit the service after being told I need to contact DWP', (I) => {

    I.click(content.govuk);
    I.amOnPage('https://www.gov.uk');

});
