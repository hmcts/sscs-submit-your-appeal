const hearingArrangementsContentEn = require('../../../../steps/hearing/arrangements/content.en');
const hearingArrangementsContentCy = require('../../../../steps/hearing/arrangements/content.cy');
const hearingData = require('../../data.en').hearing;

async function checkAllArrangementsAndContinue(page, commonContent, language) {
  const hearingArrangementsContent = language === 'en' ? hearingArrangementsContentEn : hearingArrangementsContentCy;

  await page.getByText(hearingArrangementsContent.fields.selection.languageInterpreter.requested.label).first().click();
  await page.getByText(hearingArrangementsContent.fields.selection.signLanguage.requested.label).first().click();
  await page.getByText(hearingArrangementsContent.fields.selection.hearingLoop.requested.label).first().click();
  await page.getByText(hearingArrangementsContent.fields.selection.accessibleHearingRoom.requested.label).first().click();
  await page.getByText(hearingArrangementsContent.fields.selection.anythingElse.requested.label).first().click();

  await page.fill('input[id="selection.interpreterLanguage.language"]', hearingData.interpreterLanguageType);

  await page.fill('input[id="selection.signLanguage.language"]', hearingData.signLanguageType);

  await page.fill('textarea[name="selection.anythingElse.language"]', hearingData.anythingElse);

  await page.getByText(commonContent.continue).first().click();
}

module.exports = { checkAllArrangementsAndContinue };
