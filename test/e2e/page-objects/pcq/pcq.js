const { checkCYPCQOptionAndContinue, checkPCQOptionAndContinue } = require('../controls/option');
const { expect } = require('@playwright/test');

async function skipPcq(I) {
  // if (config.features.pcq.enabled === 'true') {
  // This will need to be changed to 'I don\'t want to answer these questions' once the PCQ side of SSCS is merged.
  await I.getByText('I don\'t want to answer these questions').first().click();
  // }
}

async function skipPcqCY(I) {
  await expect(I.getByText('Dydw i ddim eisiau ateb y cwestiynau hyn').first()).toBeVisible();
  await I.getByText('Dydw i ddim eisiau ateb y cwestiynau hyn').first().click();
}

async function completeAllPcq(I) {
  await expect(I.getByText('Continue to the question').first()).toBeVisible();
  await I.getByText('Continue to the question').first().click();
  await checkPCQOptionAndContinue(I, '#language_main');
  await checkPCQOptionAndContinue(I, '#sex');
  await checkPCQOptionAndContinue(I, '#gender_different');
  await checkPCQOptionAndContinue(I, '#sexuality');
  await checkPCQOptionAndContinue(I, '#marriage-2');
  await checkPCQOptionAndContinue(I, '#ethnic_group');
  await checkPCQOptionAndContinue(I, '#ethnicity-2');
  await checkPCQOptionAndContinue(I, '#religion-3');
  await checkPCQOptionAndContinue(I, '#pregnancy-2');
  await I.getByRole('button', { name: 'Continue' }).first().click();
}

async function completeAllPcqCY(I) {
  await expect(I.getByText('Ymlaen i’r cwestiynau').first()).toBeVisible();
  await I.getByText('Ymlaen i’r cwestiynau').first().click();
  await checkCYPCQOptionAndContinue(I, '#language_main');
  await checkCYPCQOptionAndContinue(I, '#sex');
  await checkCYPCQOptionAndContinue(I, '#gender_different');
  await checkCYPCQOptionAndContinue(I, '#sexuality');
  await checkCYPCQOptionAndContinue(I, '#marriage-2');
  await checkCYPCQOptionAndContinue(I, '#ethnic_group');
  await checkCYPCQOptionAndContinue(I, '#ethnicity-2');
  await checkCYPCQOptionAndContinue(I, '#religion-3');
  await checkCYPCQOptionAndContinue(I, '#pregnancy-2');
  await I.getByText('Symud ymlaen').first().click();
}


module.exports = { skipPcq,
  completeAllPcq,
  skipPcqCY,
  completeAllPcqCY };
