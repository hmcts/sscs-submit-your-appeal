// eslint-disable-next-line no-undef
const I = actor();
class WhatLanguageDoYouWantToChoose {
  verifyIBADetailsHeader() {
    I.seeElement('//a[contains(.,\'Appeal an infected blood compensation decision\')]');
  }
  verifyPageContent() {
    I.see('What language do you want us to use when we contact you?', 'h1');
    I.see('We’ll send you emails and documents as we progress your appeal.');
    I.see('Choose which language you’d like these in.');
    I.see('English only');
    I.see('English and Welsh');
    I.see('All documents will be in English.');
  }

  inputLanguagePreferenceForAppeal(appealLanguagePreference = 'en') {
    if (appealLanguagePreference === 'en') {
      I.click('#languagePreferenceWelsh-no');
    } else {
      I.click('#languagePreferenceWelsh-yes');
    }
  }

  clickContinue() {
    I.click('Continue');
  }
}

module.exports = new WhatLanguageDoYouWantToChoose();
