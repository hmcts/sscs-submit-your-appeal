function chooseLanguagePreference(commonContent, answer) {
  const I = this;
  I.click({ id: `languagePreferenceWelsh-${answer}` });
  I.click(commonContent.continue);
}

module.exports = { chooseLanguagePreference };
