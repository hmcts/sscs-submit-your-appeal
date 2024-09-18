const appellant = require('test/e2e/data.en').appellant;
const config = require('config');
const postcodeLookupContentEn = require('components/postcodeLookup/content.en');
const postcodeLookupContentCy = require('components/postcodeLookup/content.cy');
const appellantNameContentEn = require('steps/identity/appellant-name/content.en');
const appellantNameContentCy = require('steps/identity/appellant-name/content.cy');
const appellantDOBContentEn = require('steps/identity/appellant-dob/content.en');
const appellantDOBContentCy = require('steps/identity/appellant-dob/content.cy');
const appellantNINOContentEn = require('steps/identity/appellant-nino/content.en');
const appellantNINOContentCy = require('steps/identity/appellant-nino/content.cy');

const postcodeLookupEnabled = config.get('postcodeLookup.enabled') === 'true';
const { expect } = require('@playwright/test');

async function enterAppellantNameAndContinue(page, language, commonContent, title, firstName, lastName) {
  const appellantNameContent = language === 'en' ? appellantNameContentEn : appellantNameContentCy;

  await expect(page.getByText(appellantNameContent.title.withoutAppointee)).toBeVisible({ timeout: 45000 });
  await page.selectOption('#title', title);
  await page.fill({ id: 'firstName' }, firstName);
  await page.fill({ id: 'lastName' }, lastName);
  await page.click(commonContent.continue);
}

async function enterAppellantNameAndContinueAfterSignIn(page, language, commonContent, title, firstName, lastName) {
  const appellantNameContent = language === 'en' ? appellantNameContentEn : appellantNameContentCy;

  await expect(page.getByText(appellantNameContent.title.withoutAppointee)).toBeVisible({ timeout: 45000 });
  await page.selectOption('#title', title);
  await page.fill({ id: 'firstName' }, firstName);
  await page.fill({ id: 'lastName' }, lastName);
  await page.click(commonContent.saveAndContinue);
}

async function enterAppellantDOBAndContinue(page, language, commonContent, day, month, year) {
  const appellantDOBContent = language === 'en' ? appellantDOBContentEn : appellantDOBContentCy;

  await expect(page.getByText(appellantDOBContent.title.withoutAppointee)).toBeVisible({ timeout: 45000 });
  await page.fill('input[name*="day"]', day);
  await page.fill('input[name*="month"]', month);
  await page.fill('input[name*="year"]', year);
  await page.click(commonContent.continue);
}

async function enterAppellantDOBAndContinueAfterSignIn(page, language, commonContent, day, month, year) {
  const appellantDOBContent = language === 'en' ? appellantDOBContentEn : appellantDOBContentCy;

  await expect(page.getByText(appellantDOBContent.title.withoutAppointee)).toBeVisible({ timeout: 45000 });
  await page.fill('input[name*="day"]', day);
  await page.fill('input[name*="month"]', month);
  await page.fill('input[name*="year"]', year);
  await page.click(commonContent.saveAndContinue);
}

async function enterAppellantNINOAndContinue(page, language, commonContent, nino) {
  const appellantNINOContent = language === 'en' ? appellantNINOContentEn : appellantNINOContentCy;

  await expect(page.getByText(appellantNINOContent.title.withoutAppointee)).toBeVisible({ timeout: 45000 });
  await page.fill('#nino', nino);
  await page.click(commonContent.continue);
}

async function enterAppellantNINOAndContinueAfterSignIn(page, language, commonContent, nino) {
  const appellantNINOContent = language === 'en' ? appellantNINOContentEn : appellantNINOContentCy;

  await expect(page.getByText(appellantNINOContent.title.withoutAppointee)).toBeVisible({ timeout: 45000 });
  await page.fill('#nino', nino);
  await page.click(commonContent.saveAndContinue);
}

async function IenterAddressDetailsManual(page) {
  if (postcodeLookupEnabled) {
    await page.click({ id: 'manualLink' });
  }
  await page.waitForTimeout(5000);
  await page.fill({ id: 'addressLine1' }, appellant.contactDetails.addressLine1);
  await page.fill({ id: 'addressLine2' }, appellant.contactDetails.addressLine2);
  await page.fill({ id: 'townCity' }, appellant.contactDetails.townCity);
  await page.fill({ id: 'county' }, appellant.contactDetails.county);
  await page.fill({ id: 'postCode' }, appellant.contactDetails.postCode);
}

async function IenterAddressDetails(page, postcodeLookupContent) {
  if (postcodeLookupEnabled) {
    await page.fill({ id: 'postcodeLookup' }, appellant.contactDetails.postCode);
    await page.click(postcodeLookupContent.findAddress);
    await page.waitForTimeout(5000);
    await page.selectOption('form select[name=postcodeAddress]', appellant.contactDetails.addressLine1);
  } else {
    await IenterAddressDetailsManual(page);
  }
}

async function enterAppellantContactDetailsManuallyAndContinue(page, commonContent) {
  await await page.waitForTimeout(20000);
  await IenterAddressDetailsManual(page);
  await await page.waitForTimeout(20000);
  await page.fill('#phoneNumber', '07466748336');
  await page.click(commonContent.continue);
}

async function enterAppellantContactDetailsAndContinue(page, commonContent, language) {
  const postcodeLookupContent = language === 'en' ? postcodeLookupContentEn : postcodeLookupContentCy;

  if (postcodeLookupEnabled) {
    await page.fill({ id: 'postcodeLookup' }, 'xxxxx');
    await page.click(postcodeLookupContent.findAddress);
    await expect(page.getByText(postcodeLookupContent.fields.postcodeLookup.error.required)).toBeVisible();
    await page.fill({ id: 'postcodeLookup' }, 'n29ed');
    await page.click(commonContent.continue);
    await expect(page.getByText(postcodeLookupContent.fields.postcodeAddress.error.required)).toBeVisible();
    await IenterAddressDetails(page, postcodeLookupContent);
  } else {
    await IenterAddressDetailsManual(page);
  }
  await page.click(commonContent.continue);
}

async function enterAppellantContactDetailsAndContinueAfterSignIn(page, commonContent, language) {
  const postcodeLookupContent = language === 'en' ? postcodeLookupContentEn : postcodeLookupContentCy;

  if (postcodeLookupEnabled) {
    await page.fill({ id: 'postcodeLookup' }, 'xxxxx');
    await page.click(postcodeLookupContent.findAddress);
    await expect(page.getByText(postcodeLookupContent.fields.postcodeLookup.error.required)).toBeVisible();
    await page.fill({ id: 'postcodeLookup' }, 'n29ed');
    await page.click(commonContent.continue);
    await expect(page.getByText(postcodeLookupContent.fields.postcodeAddress.error.required)).toBeVisible();
    await IenterAddressDetails(page, postcodeLookupContent);
  } else {
    await IenterAddressDetailsManual(page);
  }
  await page.click(commonContent.saveAndContinue);
}

async function enterAppellantContactDetailsWithMobileAndContinue(page, commonContent, language, mobileNumber = '07466748336') {
  const postcodeLookupContent = language === 'en' ? postcodeLookupContentEn : postcodeLookupContentCy;

  await expect(page.getByText(postcodeLookupContent.textboxLabel)).toBeVisible({ timeout: 45000 });
  await IenterAddressDetails(page, postcodeLookupContent);
  await await page.waitForTimeout(20000);
  await page.fill('#phoneNumber', mobileNumber);
  await page.click(commonContent.continue);
}

async function enterAppellantContactDetailsWithMobileAndContinueAfterSignIn(page,
  commonContent,
  language,
  mobileNumber = '07466748336'
) {
  const postcodeLookupContent = language === 'en' ? postcodeLookupContentEn : postcodeLookupContentCy;

  await expect(page.getByText(postcodeLookupContent.textboxLabel)).toBeVisible({ timeout: 45000 });
  await IenterAddressDetails(page, postcodeLookupContent);
  await await page.waitForTimeout(20000);
  await page.fill('#phoneNumber', mobileNumber);
  await page.click(commonContent.saveAndContinue);
}

async function enterAppellantContactDetailsWithEmailAndContinue(page, commonContent, language) {
  const postcodeLookupContent = language === 'en' ? postcodeLookupContentEn : postcodeLookupContentCy;

  await IenterAddressDetails(page, postcodeLookupContent);
  await page.fill('#emailAddress', 'harry.potter@wizards.com');
  await page.click(commonContent.continue);
}

module.exports = {
  enterAppellantNameAndContinue,
  enterAppellantNameAndContinueAfterSignIn,
  enterAppellantDOBAndContinue,
  enterAppellantDOBAndContinueAfterSignIn,
  enterAppellantNINOAndContinue,
  enterAppellantNINOAndContinueAfterSignIn,
  enterAppellantContactDetailsAndContinue,
  enterAppellantContactDetailsAndContinueAfterSignIn,
  enterAppellantContactDetailsWithMobileAndContinue,
  enterAppellantContactDetailsWithMobileAndContinueAfterSignIn,
  enterAppellantContactDetailsWithEmailAndContinue,
  enterAppellantContactDetailsManuallyAndContinue
};
