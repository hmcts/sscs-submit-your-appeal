function signAndSubmit(name) {
  const I = this;

  I.fillField('#signer', name);
  I.click('Submit your appeal');
}

module.exports = { signAndSubmit };
