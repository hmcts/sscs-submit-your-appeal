function chooseLanguagePreference(answer) {
  const I = this;
  I.click({ id: `languagePreferenceWelsh-${answer}` });
  I.click('Continue');
}

module.exports = { chooseLanguagePreference };
