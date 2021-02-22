function signOut() {
  const I = this;
  I.click('Sign Out');
  I.wait(3);
}

function navigateToSignOut() {
  const I = this;
  I.amOnPage('/sign-out');
  I.wait(5);
}

module.exports = { signOut, navigateToSignOut };