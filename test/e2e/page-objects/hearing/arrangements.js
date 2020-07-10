const hearingArrangementsContentEn = require('steps/hearing/arrangements/content.en');
const hearingArrangementsContentCy = require('steps/hearing/arrangements/content.cy');
const hearingData = require('test/e2e/data').hearing;

function checkAllArrangementsAndContinue(commonContent, language) {
  const I = this;
  const hearingArrangementsContent = language === 'en' ? hearingArrangementsContentEn : hearingArrangementsContentCy;

  I.click(hearingArrangementsContent.fields.selection.languageInterpreter.requested.label);
  I.click(hearingArrangementsContent.fields.selection.signLanguage.requested.label);
  I.click(hearingArrangementsContent.fields.selection.hearingLoop.requested.label);
  I.click(hearingArrangementsContent.fields.selection.accessibleHearingRoom.requested.label);
  I.click(hearingArrangementsContent.fields.selection.anythingElse.requested.label);

  I.fillField('input[id="selection.interpreterLanguage.language"]',
    hearingData.interpreterLanguageType);

  I.fillField('input[id="selection.signLanguage.language"]',
    hearingData.signLanguageType);

  I.fillField('textarea[name="selection.anythingElse.language"]',
    hearingData.anythingElse);

  I.click(commonContent.continue);
}

module.exports = { checkAllArrangementsAndContinue };
