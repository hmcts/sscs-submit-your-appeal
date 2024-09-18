const hearingArrangementsContentEn = require('steps/hearing/arrangements/content.en');
const hearingArrangementsContentCy = require('steps/hearing/arrangements/content.cy');
const hearingData = require('test/e2e/data.en').hearing;

function checkAllArrangementsAndContinue(page, commonContent, language) {
  
  const hearingArrangementsContent = language === 'en' ? hearingArrangementsContentEn : hearingArrangementsContentCy;

  await page.click(hearingArrangementsContent.fields.selection.languageInterpreter.requested.label);
  await page.click(hearingArrangementsContent.fields.selection.signLanguage.requested.label);
  await page.click(hearingArrangementsContent.fields.selection.hearingLoop.requested.label);
  await page.click(hearingArrangementsContent.fields.selection.accessibleHearingRoom.requested.label);
  await page.click(hearingArrangementsContent.fields.selection.anythingElse.requested.label);

  await page.fill('input[id="selection.interpreterLanguage.language"]', hearingData.interpreterLanguageType);

  await page.fill('input[id="selection.signLanguage.language"]', hearingData.signLanguageType);

  await page.fill('textarea[name="selection.anythingElse.language"]', hearingData.anythingElse);

  await page.click(commonContent.continue);
}

module.exports = { checkAllArrangementsAndContinue };
