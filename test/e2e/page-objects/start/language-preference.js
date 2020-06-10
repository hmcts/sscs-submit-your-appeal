function chooseLanguagePreference(answer) {
  const I = this;
  I.click({ id: `languagePreference-${answer}` });
  I.click('Continue');
}

module.exports = { chooseLanguagePreference };
