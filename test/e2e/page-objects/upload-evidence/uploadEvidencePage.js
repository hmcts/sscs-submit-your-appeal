function uploadAPieceOfEvidence() {
  const I = this;
  I.wait(1);
  I.attachFile('#uploadEv', 'evidence.txt');
  I.wait(2);
  I.click('Continue');
  I.wait(2);
}

module.exports = {
  uploadAPieceOfEvidence
};
