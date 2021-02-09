function signIn(username, password) {
  const I = this;
  I.fillField({ id: 'username' }, username);
  I.fillField({ id: 'password' }, password);
  I.click({ name: 'save' });
  I.wait(3);
}

function navigateToSignInLink() {
  const I = this;
  I.click('Sign back into your appeal');
  I.wait(5);
}


module.exports = { signIn, navigateToSignInLink };