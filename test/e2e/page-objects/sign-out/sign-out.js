const { expect } = require('@playwright/test');

async function signOut(I, language) {
  const signOutLink = I.getByRole('link', { name: language === 'en' ? 'Sign Out' : 'Allgofnodi' });
  await signOutLink.first().click({ noWaitAfter: true });
  await expect(signOutLink).toHaveCount(0, { timeout: 60000 });
}

async function navigateToSignOut(I) {
  await I.goto('/sign-out');
}

module.exports = { signOut, navigateToSignOut };
