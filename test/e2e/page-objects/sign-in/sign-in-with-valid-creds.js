const paths = require('paths');
const { expect } = require('@playwright/test');


async function newSignInFlow(I, username, password) {
  const newUsername = I.locator('#email').first();
  const newPassword = I.locator('#password').first();
  const continueButton = I.locator("//*[@id='main-content']/div/div/form/div[@class='govuk-button-group']/button").first();

  await I.locator("//a[@href='/enter-email']").first().click();
  await newUsername.fill(username);
  console.log('newSignInFlow: username=',username);
  await continueButton.click();
  await expect(newPassword).toBeVisible({ timeout: 5000 });
  await newPassword.fill(password);
  console.log('newSignInFlow: password=',password);
  await continueButton.click();
}

async function oldSignInFlow(I, username, password) {
  await I.locator('#username').first().fill(username);
  await I.locator('#password').first().fill(password);
  await I.locator("[name='save']").first().click();
}

async function isNewLoginPresent(I) {
  try {
    await expect(I.getByText('Sign in or create an account').first()).toBeVisible({ timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

async function signIn(I, username, password, language) {
  let newLoginPresent = false;

  newLoginPresent = await isNewLoginPresent(I);
  console.log('signIn: newLoginPresent=', newLoginPresent);
  const loginFlow = newLoginPresent ? newSignInFlow : oldSignInFlow;
  await loginFlow(I, username, password);

  const buttonText = language === 'en' ? 'Continue your application' : 'Parhau á’ch cais';
  const continueApplication = I.locator(`.govuk-button:has-text('${buttonText}')`).first();
  try {
    await expect(continueApplication).toBeVisible();
  } catch {
    await I.locator("[name='save']").first().click();
    await expect(continueApplication).toBeVisible();
  }

  const titleText = language === 'en' ? 'Check your answers' : 'Gwiriwch eich atebion';
  await expect(I.getByText(titleText).first()).toBeVisible();
}

async function signBackIn(I, username, password, language) {
  let newLoginPresent = false;
  newLoginPresent = await isNewLoginPresent(I);
  console.log('signIn: newLoginPresent=', newLoginPresent);
  const loginFlow = newLoginPresent ? newSignInFlow : oldSignInFlow;
  await loginFlow(I, username, password);

  // await I.waitForTimeout(5000);
  try {
    await expect(I.locator(".form-buttons-group [href='/new-appeal']").first()).toBeVisible();
  } catch {
    await I.locator("[name='save']").first().click();
    await expect(I.locator(".form-buttons-group [href='/new-appeal']").first()).toBeVisible();
  }
  const titleText = language === 'en' ? 'Your draft benefit appeals' : 'Drafft o’ch apeliadau ynghylch budd-daliadau';
  await expect(I.getByText(titleText).first()).toBeVisible();
}

async function signInVerifylanguage(I, username, password, language) {
  let newLoginPresent = false;
  newLoginPresent = await isNewLoginPresent(I);
  console.log('signIn: newLoginPresent=', newLoginPresent);
  const loginFlow = newLoginPresent ? newSignInFlow : oldSignInFlow;
  await loginFlow(I, username, password);

  try {
    const buttonText = language === 'en' ? 'Continue your application' : 'Parhau á’ch cais';
    await expect(I.locator(`.govuk-button:has-text('${buttonText}')`).first()).toBeVisible();
  } catch {
    await I.locator("[name='save']").first().click();
    const buttonText = language === 'en' ? 'Continue your application' : 'Parhau á’ch cais';
    await expect(I.locator(`.govuk-button:has-text('${buttonText}')`).first()).toBeVisible();
  }
  const altLang = await I.locator('.language').innerText();
  if (
    (altLang.trim() === 'English' && language === 'en') || (altLang.trim() === 'Cymraeg' && language === 'cy')
  ) {
    await I.goto(`${paths.drafts}?lng=${language}`);
  }

  const titleText = language === 'en' ? 'Check your answers' : 'Gwiriwch eich atebion';
  await expect(I.getByText(titleText).first()).toBeVisible();
}

async function navigateToSignInLink(I) {
  await I.getByText('Sign back into your appeal').first().click();
}

module.exports = { signIn, signBackIn, signInVerifylanguage, navigateToSignInLink };
