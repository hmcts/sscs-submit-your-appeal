function uploadAPieceOfEvidence() {
  const I = this;
  I.attachFile('#uploadEv', 'evidence.txt');
  I.wait(3);
  I.click('.govuk-button');
}

module.exports = {
  uploadAPieceOfEvidence
};
