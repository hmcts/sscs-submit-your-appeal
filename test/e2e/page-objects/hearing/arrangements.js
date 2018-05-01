const fields = require('steps/hearing/arrangements/content.en.json').fields;
const hearingData = require('test/e2e/data').hearing;

function checkAllArrangementsAndContinue() {
  const I = this;

  I.click(fields.selection.languageInterpreter.requested.label);
  I.click(fields.selection.signLanguage.requested.label);
  I.click(fields.selection.hearingLoop.requested.label);
  I.click(fields.selection.accessibleHearingRoom.requested.label);
  I.click(fields.selection.anythingElse.requested.label);

  I.fillField('input[id="selection.interpreterLanguage.language"]',
    hearingData.interpreterLanguageType);

  I.fillField('input[id="selection.signLanguage.language"]',
    hearingData.signLanguageType);

  I.fillField('textarea[name="selection.anythingElse.language"]',
    hearingData.anythingElse);

  I.click('Continue');
}

module.exports = { checkAllArrangementsAndContinue };
