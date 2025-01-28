async function signOut(I, language) {
  if (language === 'en') {
    await I.getByText('Sign Out').first().click();
  } else {
    await I.getByText('Allgofnodi').first().click();
  }
}

async function navigateToSignOut(I) {
  await I.goto('/sign-out');
}

module.exports = { signOut, navigateToSignOut };
