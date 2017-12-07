'use strict';

const paths = require('paths');
const content = require('valid-postcode-pages/enter-postcode/content.en.json');

Feature('Enter postcode');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.validPostcode.postcodeCheck);
});

Scenario('When I go to the enter postcode page I see the page heading', (I) => {

    I.see(content.title);

});

Scenario('When I enter a valid postcode that is on the list, I go to the Independence page', (I) => {

    I.fillField('#postcode', 'WV11 2HE');
    I.click('Continue');
    I.seeInCurrentUrl(paths.start.independence);

});

Scenario('When I enter a valid postcode that is not on the list, I go to the invalid postcode page', (I) => {

    I.fillField('#postcode', 'SW1P 4DF');
    I.click('Continue');
    I.seeInCurrentUrl(paths.validPostcode.invalidPostcode);

});

Scenario('When I enter an invalid postcode I see an error', (I) => {

    I.fillField('#postcode', 'INVALID POSTCODE');
    I.click('Continue');
    I.seeInCurrentUrl(paths.validPostcode.postcodeCheck);
    I.see(content.fields.postcode.error.invalid);

});

Scenario('When I leave the postcode field empty and continue, I see an error', (I) => {

    I.fillField('#postcode', '');
    I.click('Continue');
    I.seeInCurrentUrl(paths.validPostcode.postcodeCheck);
    I.see(content.fields.postcode.error.required);

});
