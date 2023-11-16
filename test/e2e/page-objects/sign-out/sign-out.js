function signOut(language) {
  const I = this;
  if (language === 'en') {
    I.retry({ retries: 3, minTimeout: 5000 }).click('Sign Out');
  } else {
    I.retry({ retries: 3, minTimeout: 5000 }).click('Allgofnodi');
  }
  I.wait(1);
}

function navigateToSignOut() {
  const I = this;
  I.amOnPage('/sign-out');
  I.wait(2);
}

module.exports = { signOut, navigateToSignOut };
