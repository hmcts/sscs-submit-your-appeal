function selectContinue() {
  const I = this;

  I.click('Continue');
}

function enterDescription(description) {
  const I = this;
  I.seeInCurrentUrl('evidence-description');
  I.fillField('textarea[name="describeTheEvidence"]', description);
  I.click('Continue');
}

module.exports = { selectContinue, enterDescription };
