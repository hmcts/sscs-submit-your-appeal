async function createTheSession(page, language) {
  await page.goto(
    `/entry?lng=${language}`,
    `to create a session in ${language.toUpperCase()}`
  );
}

module.exports = { createTheSession };
