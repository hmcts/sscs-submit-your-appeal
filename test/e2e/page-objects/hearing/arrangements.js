const hearingArrangementsContentEn = require('steps/hearing/arrangements/content.en');
const hearingArrangementsContentCy = require('steps/hearing/arrangements/content.cy');
const hearingData = require('test/e2e/data.en').hearing;

async function checkAllArrangementsAndContinue(I, commonContent, language) {
  const hearingArrangementsContent = language === 'en' ? hearingArrangementsContentEn : hearingArrangementsContentCy;

  await I.getByText(hearingArrangementsContent.fields.selection.languageInterpreter.requested.label).first().click();
  await I.getByText(hearingArrangementsContent.fields.selection.signLanguage.requested.label).first().click();
  await I.getByText(hearingArrangementsContent.fields.selection.hearingLoop.requested.label).first().click();
  await I.getByText(hearingArrangementsContent.fields.selection.accessibleHearingRoom.requested.label).first().click();
  await I.getByText(hearingArrangementsContent.fields.selection.anythingElse.requested.label).first().click();

  await I.locator('input[id="selection.interpreterLanguage.language"]').first().fill(hearingData.interpreterLanguageType);

  await I.locator('input[id="selection.signLanguage.language"]').first().fill(hearingData.signLanguageType);

  await I.locator('textarea[name="selection.anythingElse.language"]').first().fill(hearingData.anythingElse);

  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

module.exports = { checkAllArrangementsAndContinue };
