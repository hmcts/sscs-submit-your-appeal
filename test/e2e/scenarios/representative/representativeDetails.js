'use strict';

const paths = require('paths');
const content = require('steps/representative/representative-details/content.en.json');

Feature('Representative Details');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.representative.representativeDetails)
});

After((I) => {
    I.endTheSession();
});

Scenario('When I fill in the fields and continue, I am taken to the reason for appealing page', (I) => {

    I.enterRequiredRepresentativeDetails();
    I.click('Continue');
    I.seeInCurrentUrl(paths.reasonsForAppealing.reasonForAppealing);

});

Scenario('When I click the no details link, I am taken to the no representative details page', (I) => {

    I.click(content.noDetails);
    I.seeInCurrentUrl(paths.representative.noRepresentativeDetails);

});
