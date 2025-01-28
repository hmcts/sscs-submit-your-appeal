async function endTheSession(I) {
  await I.goto('/exit', 'to end the current session');
}

module.exports = { endTheSession };
