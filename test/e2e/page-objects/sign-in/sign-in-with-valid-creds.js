function signIn(username, password) {
  const I = this;
  I.fillField({ id: 'username' }, username);
  I.fillField({ id: 'password' }, password);
  I.click({ name: 'save' });
  I.wait(3);
}

module.exports = { signIn };