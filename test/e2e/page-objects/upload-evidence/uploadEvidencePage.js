function uploadAPieceOfEvidence() {
  const I = this;
  I.attachFile('#uploadEv', 'evidence.txt');
  I.click('.button');
}

module.exports = {
  uploadAPieceOfEvidence
};
