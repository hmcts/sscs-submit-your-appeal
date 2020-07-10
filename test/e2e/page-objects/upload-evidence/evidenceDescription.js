function selectContinue() {
  const I = this;

  I.click('Continue');
}

function enterDescription(commonContent, description) {
  const I = this;
  I.seeInCurrentUrl('evidence-description');
  I.fillField('textarea[name="describeTheEvidence"]', description);
  I.click(commonContent.continue);
}

module.exports = { selectContinue, enterDescription };
