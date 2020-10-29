function enterDWPIssuingOfficeAndContinue(commonContent, id) {
  const I = this;

  I.scrollPageToBottom();
  I.selectOption({ id: 'pipNumber' }, id);
  I.click(commonContent.continue);
}

function enterDWPIssuingOffice(commonContent, id, benefitTypeCode) {
  const I = this;

  I.scrollPageToBottom();
  if (benefitTypeCode === 'ESA') {
    I.selectOption({ id: 'dwpIssuingOffice' }, id);
  }
  I.click(commonContent.continue);
}

function seeDWPIssuingOfficeError(url, error) {
  const I = this;

  I.seeInCurrentUrl(url);
  I.see(error);
}

module.exports = {
  enterDWPIssuingOfficeAndContinue,
  enterDWPIssuingOffice,
  seeDWPIssuingOfficeError
};
