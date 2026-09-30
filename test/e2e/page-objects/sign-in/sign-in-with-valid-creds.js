const paths = require('paths');
const { expect } = require('@playwright/test');


async function newSignInFlow(I, username, password) {

    const newUsername = I.locator("#email").first();
    const newPassword = I.locator("#password").first();
    const newContinue = I.getByRole('button', { name: /continue/i }).first();

    await I.click('Sign in');
    await newUsername.fill(username);
    await expect(newContinue).toBeVisible();
    await expect(newContinue).toBeEnabled();
    await I.click('Continue');

    await expect(newPassword).toBeVisible({ timeout: 5000 });
    await newPassword.fill(password);
    await expect(newContinue).toBeEnabled();
    await I.click('Continue');

}

async function oldSignFlow(I, username, password) {
    await I.locator('#username').first().fill(username);
    await I.locator('#password').first().fill(password);
    await I.locator("[name='save']").first().click();
}

async function signIn(I, username, password, language) {

  let newLoginPresent = false;
  try {
    await expect(I.getByText("Sign in or create an account").first()).toBeVisible({ timeout: 5000 });
    newLoginPresent = true;
  } catch {
    newLoginPresent = false;
  }
  console.log('signIn: newLoginPresent=', newLoginPresent);

  await(newLoginPresent
      ? newSignInFlow(I, username, password)
      : oldSignFlow(I, username, password)
  );

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
  try {
    await expect(I.getByText("Sign in or create an account").first()).toBeVisible({ timeout: 5000 });
    newLoginPresent = true;
  } catch {
    newLoginPresent = false;
  }
  console.log('signIn: newLoginPresent=', newLoginPresent);

  await(newLoginPresent
      ? newSignInFlow(I, username, password)
      : oldSignFlow(I, username, password)
  );
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
  try {
    await expect(I.getByText("Sign in or create an account").first()).toBeVisible({ timeout: 5000 });
    newLoginPresent = true;
  } catch {
    newLoginPresent = false;
  }
  console.log('signIn: newLoginPresent=', newLoginPresent);

  await(newLoginPresent
      ? newSignInFlow(I, username, password)
      : oldSignFlow(I, username, password)
  );

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
