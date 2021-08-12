function uploadAPieceOfEvidence() {
  const I = this;
  I.wait(3);
  I.attachFile('#uploadEv', 'evidence.txt');
  I.wait(5);
  I.click('Continue');
  I.wait(5);
}

module.exports = {
  uploadAPieceOfEvidence
};
