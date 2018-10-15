const fields = require('steps/hearing/arrangements/content.en.json').fields;
const hearingData = require('test/e2e/data').hearing;

function checkAllArrangementsAndContinue() {
  const I = this;
  const languageInterpreterField = 'input[id="selection.interpreterLanguage.language"]';
  const signLanguageTypeField = 'input[id="selection.signLanguage.language"]';
  const anythingElseField = 'textarea[name="selection.anythingElse.language"]';

  I.click(fields.selection.languageInterpreter.requested.label);
  I.waitForVisible(languageInterpreterField);
  I.fillField(languageInterpreterField, hearingData.interpreterLanguageType);
  I.pressKey('Enter');

  I.click(fields.selection.signLanguage.requested.label);
  I.waitForVisible(signLanguageTypeField);
  I.fillField(signLanguageTypeField, hearingData.signLanguageType);
  I.pressKey('Enter');

  I.click(fields.selection.hearingLoop.requested.label);
  I.click(fields.selection.accessibleHearingRoom.requested.label);
  I.click(fields.selection.anythingElse.requested.label);
  I.waitForVisible(anythingElseField);
  I.fillField(anythingElseField, hearingData.anythingElse);

  I.click('Continue');
}

module.exports = { checkAllArrangementsAndContinue };
