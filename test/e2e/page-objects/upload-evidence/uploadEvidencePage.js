function uploadAPieceOfEvidence() {
  const I = this;
  I.waitForVisible('label[for="uploadEv"]');
  I.attachFile('#uploadEv', 'evidence.txt');
  I.waitForVisible('span[data-index="items-0"]');
  I.waitForVisible('.add-another-delete-link');
  I.click('Continue');
}

module.exports = {
  uploadAPieceOfEvidence
};
