'use strict';

const urls = require('urls');

Feature('Representative');

Before((I) => {
    I.createTheSession();
    I.amOnPage(urls.representative.representative)
});

After((I) => {
    I.endTheSession();
});

Scenario('When I select yes, I am taken to the representative details page', (I) => {

    I.selectDoYouHaveARepresentativeAndContinue('#Representative_hasRepresentative-yes');
    I.seeInCurrentUrl(urls.representative.representativeDetails);

});

Scenario('When I select No, I am taken to the reason for appealing page', (I) => {

    I.selectDoYouHaveARepresentativeAndContinue('#Representative_hasRepresentative-no');
    I.seeInCurrentUrl(urls.reasonsForAppealing.reasonForAppealing);

});
