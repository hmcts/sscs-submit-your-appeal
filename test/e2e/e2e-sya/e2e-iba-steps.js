const WhatLanguageDoYouWantToChoosePage = require('../page/iba/whatLanguageDoYouWantToChoose');

class IBASteps {
  WhatLanguageDoYouWantToChoosePageContent() {
    WhatLanguageDoYouWantToChoosePage.verifyIBADetailsHeader();
    WhatLanguageDoYouWantToChoosePage.verifyPageContent();
    WhatLanguageDoYouWantToChoosePage.inputLanguagePreferenceForAppeal();
    WhatLanguageDoYouWantToChoosePage.clickContinue();
  }
}

module.exports = new IBASteps();
