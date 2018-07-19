function selectContinue() {
  const I = this;

  I.click('Continue');
}

function enterDescription(description) {
  const I = this;

  I.fillField('textarea[name="describeTheEvidence"]', description);
}

module.exports = { selectContinue, enterDescription };
