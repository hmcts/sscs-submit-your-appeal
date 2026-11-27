async function signOut(I, language) {
  const signOutLink = I.getByRole('link', { name: language === 'en' ? 'Sign Out' : 'Allgofnodi' });
  const signedOut = I.waitForResponse(
    response => new URL(response.url()).pathname === '/sign-out' && response.status() === 200,
    { timeout: 60000 }
  );
  await signOutLink.first().click({ noWaitAfter: true });
  await signedOut;
}

async function navigateToSignOut(I) {
  await I.goto('/sign-out');
}

module.exports = { signOut, navigateToSignOut };
