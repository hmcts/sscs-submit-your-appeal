'use strict';

const fields = require('steps/hearing/arrangements/content.en.json').fields;
const data = require('test/e2e/data').hearing;

function checkAllArrangementsAndContinue() {

    const I = this;

    I.click(fields.selection.languageInterpreter.requested.label);
    I.click(fields.selection.signLanguage.requested.label);
    I.click(fields.selection.hearingLoop.requested.label);
    I.click(fields.selection.accessibleHearingRoom.requested.label);
    I.click(fields.selection.anythingElse.requested.label);

    I.fillField('input[id="selection.interpreterLanguage.language"]', data.interpreterLanguageType);
    I.fillField('input[id="selection.signLanguage.language"]', data.signLanguageType);
    I.fillField('textarea[name="selection.anythingElse.language"]', data.anythingElse);

    I.click('Continue');

}

module.exports = { checkAllArrangementsAndContinue };
