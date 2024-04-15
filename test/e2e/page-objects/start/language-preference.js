function chooseLanguagePreference(commonContent, answer) {
  const I = this;

  I.waitForText('What language do you want us to use when we contact you?');
  I.click({ id: `languagePreferenceWelsh-${answer}` });
  I.click(commonContent.continue);
}

function chooseLanguagePreferenceAfterSignIn(commonContent, answer) {
  const I = this;
  I.waitForText('Pa iaith yr hoffech inni ei defnyddio wrth gysylltu efo chi?');
  I.click({ id: `languagePreferenceWelsh-${answer}` });
  I.click(commonContent.saveAndContinue);
}

module.exports = { chooseLanguagePreference, chooseLanguagePreferenceAfterSignIn };
