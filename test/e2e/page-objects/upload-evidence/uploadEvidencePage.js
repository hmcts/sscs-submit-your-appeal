function uploadAPieceOfEvidence() {
  const I = this;
  I.attachFile('#uploadEv', 'evidence.txt');
  I.click('.govuk-button');
}

module.exports = {
  uploadAPieceOfEvidence
};
