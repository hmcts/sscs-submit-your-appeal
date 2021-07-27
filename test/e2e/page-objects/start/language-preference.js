function chooseLanguagePreference(commonContent, answer) {
  const I = this;
  I.click({ id: `languagePreferenceWelsh-${answer}` });
  I.click(commonContent.continue);
}

function chooseLanguagePreferenceAfterSignIn(commonContent, answer) {
  const I = this;
  I.click({ id: `languagePreferenceWelsh-${answer}` });
  I.click(commonContent.saveAndContinue);
}

module.exports = { chooseLanguagePreference, chooseLanguagePreferenceAfterSignIn };
