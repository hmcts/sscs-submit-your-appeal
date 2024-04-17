const lanugagePreferenceContentEn = require('steps/start/language-preference/content.en');
const lanugagePreferenceContentCy = require('steps/start/language-preference/content.cy');


function chooseLanguagePreference(language, commonContent, answer) {
  const I = this;
  const lanugagePreferenceContent = language === 'en' ? lanugagePreferenceContentEn : lanugagePreferenceContentCy;

  I.waitForText(lanugagePreferenceContent.title);
  I.click({ id: `languagePreferenceWelsh-${answer}` });
  I.click(commonContent.continue);
}

function chooseLanguagePreferenceAfterSignIn(language, commonContent, answer) {
  const I = this;
  const lanugagePreferenceContent = language === 'en' ? lanugagePreferenceContentEn : lanugagePreferenceContentCy;

  I.waitForText(lanugagePreferenceContent.title);
  I.click({ id: `languagePreferenceWelsh-${answer}` });
  I.click(commonContent.saveAndContinue);
}

module.exports = { chooseLanguagePreference, chooseLanguagePreferenceAfterSignIn };
