'use strict';

const content = require('steps/compliance/contact-dwp/content.en.json');
const urls = require('urls');

Feature('Contact DWP');

Before((I) => {
    I.createTheSession();
    I.amOnPage(urls.compliance.contactDWP)
});

After((I) => {
    I.endTheSession();
});

Scenario('I exit the service after being told I need to contact DWP', (I) => {

    I.click(content.govuk);
    I.amOnPage('https://www.gov.uk');

});
