function enterDWPIssuingOfficeAndContinue(id) {
  const I = this;

  I.fillField({ id: 'dwpIssuingOffice' }, id);
  I.click('Continue');
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
