'use strict';

const content = require('steps/check-your-appeal/content.en.json');
const urls = require('urls');

function goToConfirmationPage() {

    const I = this;

    I.click(content.submit);
    I.seeInCurrentUrl(urls.confirmation);

}

module.exports = { goToConfirmationPage };