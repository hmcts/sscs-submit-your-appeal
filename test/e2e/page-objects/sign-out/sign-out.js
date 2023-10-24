function signOut(language) {
  const I = this;
  if (language === 'en') {
    I.click('Sign Out');
  } else {
    I.click('Allgofnodi');
  }
  I.wait(1);
}

function navigateToSignOut() {
  const I = this;
  I.amOnPage('/sign-out');
  I.wait(2);
}

module.exports = { signOut, navigateToSignOut };
