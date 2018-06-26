async function uploadAPieceOfEvidence() {
  const I = this;
  await I.attachFile('#uploadEv', 'evidence.txt');
  I.click('.button');
}

module.exports = {
  uploadAPieceOfEvidence
};
