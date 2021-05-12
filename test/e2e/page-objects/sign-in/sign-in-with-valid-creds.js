function signIn(username, password) {
  const I = this;
  I.fillField({ id: 'username' }, username);
  I.fillField({ id: 'password' }, password);
  I.click({ name: 'save' });
  I.waitForElement(".form-buttons-group [href='/new-appeal']", 3);
  I.see('Your draft benefit appeals');
}

function navigateToSignInLink() {
  const I = this;
  I.click('Sign back into your appeal');
  I.wait(5);
}


module.exports = { signIn, navigateToSignInLink };