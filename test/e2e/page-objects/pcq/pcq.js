const { checkPCQOptionAndContinue } = require('../controls/option');
const { expect } = require('@playwright/test');

async function skipPcq(page) {
  // if (config.features.pcq.enabled === 'true') {

  await page.waitForTimeout(5000);
  // This will need to be changed to 'I don\'t want to answer these questions' once the PCQ side of SSCS is merged.
  await page.getByText("I don't want to answer these questions").first().click();
  // }
}

async function skipPcqCY(page) {
  await page.waitForTimeout(5000);
  await expect(page.getByText('Dydw i ddim eisiau ateb y cwestiynau hyn').first()).toBeVisible({ timeout: 45000 });
  await page.getByText('Dydw i ddim eisiau ateb y cwestiynau hyn').first().click();
}

async function completeAllPcq(page) {
  await page.waitForTimeout(5000);
  await expect(page.getByText('Continue to the question').first()).toBeVisible({ timeout: 45000 });
  await page.getByText('Continue to the question').first().click();
  await checkPCQOptionAndContinue(page, '#language_main');
  await checkPCQOptionAndContinue(page, '#sex');
  await checkPCQOptionAndContinue(page, '#gender_different');
  await checkPCQOptionAndContinue(page, '#sexuality');
  await checkPCQOptionAndContinue(page, '#marriage-2');
  await checkPCQOptionAndContinue(page, '#ethnic_group');
  await checkPCQOptionAndContinue(page, '#ethnicity-2');
  await checkPCQOptionAndContinue(page, '#religion-3');
  await checkPCQOptionAndContinue(page, '#pregnancy-2');
  await page.getByText('Continue').first().click();
}

async function completeAllPcqCY(page) {
  await page.waitForTimeout(5000);
  await expect(page.getByText('Ymlaen i’r cwestiynau').first()).toBeVisible({ timeout: 45000 });
  await page.getByText('Ymlaen i’r cwestiynau').first().click();
  await checkPCQOptionAndContinue(page, '#language_main');
  await checkPCQOptionAndContinue(page, '#sex');
  await checkPCQOptionAndContinue(page, '#gender_different');
  await checkPCQOptionAndContinue(page, '#sexuality');
  await checkPCQOptionAndContinue(page, '#marriage-2');
  await checkPCQOptionAndContinue(page, '#ethnic_group');
  await checkPCQOptionAndContinue(page, '#ethnicity-2');
  await checkPCQOptionAndContinue(page, '#religion-3');
  await checkPCQOptionAndContinue(page, '#pregnancy-2');
  await page.getByText('Symud ymlaen').first().click();
}

module.exports = { skipPcq, completeAllPcq, skipPcqCY, completeAllPcqCY };
