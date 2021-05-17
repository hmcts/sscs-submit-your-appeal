function signIn(username, password, language) {
  const I = this;
  I.fillField({ id: 'username' }, username);
  I.fillField({ id: 'password' }, password);
  I.click({ name: 'save' });
  I.waitForElement(".form-buttons-group [href='/new-appeal']", 3);
  if (language === 'en') {
    I.see('Your draft benefit appeals');
  } else {
    I.see('Drafft o’ch apeliadau ynghylch budd-daliadau');
  }
}

function navigateToSignInLink() {
  const I = this;
  I.click('Sign back into your appeal');
  I.wait(5);
}


module.exports = { signIn, navigateToSignInLink };