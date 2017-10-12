'use strict';

const content = require('steps/compliance/mrn-over-thirteen-months-late/content.en.json');
const urls = require('urls');

function goToCorrectPageWhenReasonProvided() {

    const I = this;

    I.fillField('#MRNOverThirteenMonthsLate_reasonForBeingLate', 'Late');
    I.click('input[type="submit"]');
    I.seeInCurrentUrl(urls.identity.areYouAnAppointee);

}

function goToCorrectPageWhenNoReasonIsClicked() {

    const I = this;

    I.click(content.noGoodReasonWhyLate);
    I.seeInCurrentUrl(urls.compliance.cantAppeal);

}


module.exports = { goToCorrectPageWhenReasonProvided, goToCorrectPageWhenNoReasonIsClicked };
