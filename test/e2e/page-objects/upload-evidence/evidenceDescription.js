function enterDescription(commonContent, description) {
  const I = this;
  I.seeInCurrentUrl('evidence-description');
  I.fillField('textarea[name="describeTheEvidence"]', description);
  I.click(commonContent.continue);
}

module.exports = { enterDescription };
