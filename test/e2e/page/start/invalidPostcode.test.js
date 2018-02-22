'use strict';

const paths = require('paths');
const content = require('steps/start/invalid-postcode/content.en.json');

Feature('Invalid postcode');

Before((I) => {
    I.amOnPage(paths.start.invalidPostcode);
});

Scenario('When I go to the invalid postcode page I see the page heading', (I) => {

    I.see(content.title);

});

Scenario('When I click the continue to form download link, I am taken to the form on external site', (I) => {

    I.click(content.formDownload);
    I.seeInCurrentUrl('https://hmctsformfinder.justice.gov.uk/HMCTS/GetForm.do?original_id=3038');

});
