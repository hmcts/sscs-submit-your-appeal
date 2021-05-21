function enterDWPIssuingOfficeAndContinue(commonContent, id) {
  const I = this;

  I.wait(3);
  I.scrollPageToBottom();
  I.selectOption({ id: 'pipNumber' }, id);
  I.click(commonContent.continue);
}

function enterDWPIssuingOfficeAndContinueAfterSignIn(commonContent, id) {
  const I = this;

  I.scrollPageToBottom();
  I.selectOption({ id: 'pipNumber' }, id);
  I.click(commonContent.saveAndContinue);
}


function enterDWPIssuingOffice(commonContent, id) {
  const I = this;

  I.scrollPageToBottom();
  I.selectOption({ id: 'dwpIssuingOffice' }, id);
  I.click(commonContent.continue);
}

function seeDWPIssuingOfficeError(url, error) {
  const I = this;

  I.seeInCurrentUrl(url);
  I.see(error);
}

module.exports = {
  enterDWPIssuingOfficeAndContinue,
  enterDWPIssuingOfficeAndContinueAfterSignIn,
  enterDWPIssuingOffice,
  seeDWPIssuingOfficeError
};
