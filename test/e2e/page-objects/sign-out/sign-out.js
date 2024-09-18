function signOut(page, language) {
  
  if (language === 'en') {
    page.retry({ retries: 3, minTimeout: 5000 }).click('Sign Out');
  } else {
    page.retry({ retries: 3, minTimeout: 5000 }).click('Allgofnodi');
  }
  await page.waitForTimeout(1);
}

function navigateToSignOut() {
  
  page.goto('/sign-out');
  await page.waitForTimeout(2);
}

module.exports = { signOut, navigateToSignOut };
