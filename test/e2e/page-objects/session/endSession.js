function endTheSession() {
  const I = this;

  I.amOnPage('/exit', 'to end the current session');
}

module.exports = { endTheSession };
