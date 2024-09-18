async function endTheSession(page) {
  await page.goto('/exit', 'to end the current session');
}

module.exports = { endTheSession };
