'use strict';

const fields = require('steps/hearing/arrangements/content.en.json').fields;

function checkAllArrangementsAndContinue() {

    const I = this;
    //I.checkOption(fields.selection.languageInterpreter);
    I.checkOption(fields.selection.signLanguageInterpreter);
    I.checkOption(fields.selection.hearingLoop);
    I.checkOption(fields.selection.disabledAccess);
    I.click('Continue');

}

module.exports = { checkAllArrangementsAndContinue };
