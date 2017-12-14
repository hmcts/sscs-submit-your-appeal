'use strict';

const paths = require('paths');
const content = require('steps/confirmation/content.en.json');

Feature('Confirmation');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.confirmation);
});

After((I) => {
    I.endTheSession();
});

Scenario('When i go to the page I see the header', (I) => {

    I.see(content.title);

});
