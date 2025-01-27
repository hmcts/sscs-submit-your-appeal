/* eslint-disable camelcase */
/* eslint-disable no-undef */
async function clickNextIfDateNotVisible(page, dateElement) {
  try {
    const hasDate = Boolean(await page.$(`[data-date="${dateElement}"]`));
    if (!hasDate) page.click('.next');
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = { clickNextIfDateNotVisible };
