function enterDWPIssuingOfficeAndContinue(commonContent, id) {
  const I = this;

  I.fillField({ id: 'pipNumber' }, id);
  I.click(commonContent.continue);
}

function seeDWPIssuingOfficeError(url, error) {
  const I = this;

  I.seeInCurrentUrl(url);
  I.see(error);
}

module.exports = {
  enterDWPIssuingOfficeAndContinue,
  seeDWPIssuingOfficeError
};
