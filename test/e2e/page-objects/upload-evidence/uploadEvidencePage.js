function uploadAPieceOfEvidence() {
  const I = this;
  I.wait(3);
  I.attachFile('#uploadEv', 'evidence.txt');
  I.wait(3);
  I.click('.govuk-button');
  I.wait(3);
}

module.exports = {
  uploadAPieceOfEvidence
};
