/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
async function clickNextIfDateNotVisible(page, dateElement) {
  try {
    const hasDate = Boolean(await page.$(`[data-date="${dateElement}"]`));
    if (!hasDate) page.click('.next');
  } catch (error) {
    throw new Error(error);
  }
}

async function handleFlakeyBlock(I, codeBlock, maxAttempts) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      for (const line of codeBlock) {
        await line;
      }
      break;
    } catch (error) {
      if (i + 1 === maxAttempts) throw new Error(error);
      await I.reload();
      console.log(`Failed attempt ${i + 1}, trying again.`);
    }
  }
}

module.exports = { clickNextIfDateNotVisible, handleFlakeyBlock };
