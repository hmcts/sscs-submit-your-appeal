'use strict';

const content = require('steps/compliance/mrn-over-month-late/content.en.json');
const urls = require('urls');

function goToCorrectPageWhenReasonProvided() {

    const I = this;

    I.fillField('#MRNOverOneMonthLate_reasonForBeingLate', 'Late');
    I.click('input[type="submit"]');
    I.seeInCurrentUrl(urls.compliance.noMRN);

}

function goToCorrectPageWhenNoReasonIsClicked() {

    const I = this;

    I.click(content.noGoodReasonWhyLate);
    I.seeInCurrentUrl(urls.compliance.cantAppeal);

}


module.exports = { goToCorrectPageWhenReasonProvided, goToCorrectPageWhenNoReasonIsClicked };
