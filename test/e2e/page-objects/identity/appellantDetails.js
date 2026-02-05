/* eslint-disable no-await-in-loop,max-depth */
const appellant = require('test/e2e/data.en').appellant;
const config = require('config');
const paths = require('paths');
const postcodeLookupContentEn = require('components/postcodeLookup/content.en');
const postcodeLookupContentCy = require('components/postcodeLookup/content.cy');
const appellantNameContentEn = require('steps/identity/appellant-name/content.en');
const appellantNameContentCy = require('steps/identity/appellant-name/content.cy');
const appellantDOBContentEn = require('steps/identity/appellant-dob/content.en');
const appellantDOBContentCy = require('steps/identity/appellant-dob/content.cy');
const appellantNINOContentEn = require('steps/identity/appellant-nino/content.en');
const appellantNINOContentCy = require('steps/identity/appellant-nino/content.cy');

const postcodeLookupEnabled =
  config.get('postcodeLookup.enabled').toString() === 'true';
const { expect } = require('@playwright/test');

async function enterAppellantNameAndContinue(
  I,
  language,
  commonContent,
  title,
  firstName,
  lastName
) {
  const appellantNameContent =
    language === 'en' ? appellantNameContentEn : appellantNameContentCy;

  await expect(
    I.getByText(appellantNameContent.title.withoutAppointee).first()
  ).toBeVisible();
  await I.locator('#title').first().selectOption(title);
  await I.locator('#firstName').first().fill(firstName);
  await I.locator('#lastName').first().fill(lastName);
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function enterAppellantNameAndContinueAfterSignIn(
  I,
  language,
  commonContent,
  title,
  firstName,
  lastName
) {
  const appellantNameContent =
    language === 'en' ? appellantNameContentEn : appellantNameContentCy;

  await expect(
    I.getByText(appellantNameContent.title.withoutAppointee).first()
  ).toBeVisible();
  await I.locator('#title').first().selectOption(title);
  await I.locator('#firstName').first().fill(firstName);
  await I.locator('#lastName').first().fill(lastName);
  await I.getByRole('button', { name: commonContent.saveAndContinue })
    .first()
    .click();
}

async function enterAppellantDOBAndContinue(
  I,
  language,
  commonContent,
  day,
  month,
  year
) {
  const appellantDOBContent =
    language === 'en' ? appellantDOBContentEn : appellantDOBContentCy;

  await expect(
    I.getByText(appellantDOBContent.title.withoutAppointee).first()
  ).toBeVisible();
  await I.locator('input[name*="day"]').first().fill(day);
  await I.locator('input[name*="month"]').fill(month);
  await I.locator('input[name*="year"]').fill(year);
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function enterAppellantDOBAndContinueAfterSignIn(
  I,
  language,
  commonContent,
  day,
  month,
  year
) {
  const appellantDOBContent =
    language === 'en' ? appellantDOBContentEn : appellantDOBContentCy;

  await expect(
    I.getByText(appellantDOBContent.title.withoutAppointee).first()
  ).toBeVisible();
  await I.locator('input[name*="day"]').fill(day);
  await I.locator('input[name*="month"]').fill(month);
  await I.locator('input[name*="year"]').fill(year);
  await I.getByRole('button', { name: commonContent.saveAndContinue })
    .first()
    .click();
}

async function enterAppellantNINOAndContinue(I, language, commonContent, nino) {
  const appellantNINOContent =
    language === 'en' ? appellantNINOContentEn : appellantNINOContentCy;

  await expect(
    I.getByText(appellantNINOContent.title.withoutAppointee).first()
  ).toBeVisible();
  await I.locator('#nino').fill(nino);
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function enterAppellantNINOAndContinueAfterSignIn(
  I,
  language,
  commonContent,
  nino
) {
  const appellantNINOContent =
    language === 'en' ? appellantNINOContentEn : appellantNINOContentCy;

  await expect(
    I.getByText(appellantNINOContent.title.withoutAppointee).first()
  ).toBeVisible();
  await I.locator('#nino').fill(nino);
  await I.getByRole('button', { name: commonContent.saveAndContinue })
    .first()
    .click();
}

async function enterAddressDetailsManual(I) {
  if (postcodeLookupEnabled) {
    await I.locator('#manualLink').first().click();
  }
  await I.locator('#addressLine1').fill(appellant.contactDetails.addressLine1);
  await I.locator('#addressLine2').fill(appellant.contactDetails.addressLine2);
  await I.locator('#townCity').fill(appellant.contactDetails.townCity);
  await I.locator('#county').fill(appellant.contactDetails.county);
  await I.locator('#postCode').fill(appellant.contactDetails.postCode);
}

async function enterAddressDetails(I, postcodeLookupContent) {
  if (postcodeLookupEnabled) {
    for (let i = 0; i < 5; i++) {
      await I.locator('#postcodeLookup').fill(
        appellant.contactDetails.postCode
      );
      await I.getByText(postcodeLookupContent.findAddress).click();
      await I.waitForTimeout(1000);
      await I.locator('select[name="postcodeAddress"]').selectOption(
        `${appellant.contactDetails.addressLine1}, ${appellant.contactDetails.townCity}, ${appellant.contactDetails.postCode}`
      );
      await I.waitForURL(new RegExp('.*?validate=1'));
      try {
        await expect(I.locator('#addressLine1')).toHaveValue(
          appellant.contactDetails.addressLine1
        );
        break;
      } catch (error) {
        if (i === 4) throw new Error(error);
        await I.goto(paths.identity.enterAppellantContactDetails);
        console.log(`Failed address selection attempt ${i + 1}, trying again.`);
      }
    }
  } else {
    await enterAddressDetailsManual(I);
  }
}

async function enterAppellantContactDetailsManuallyAndContinue(
  I,
  commonContent
) {
  await enterAddressDetailsManual(I);
  await I.locator('#phoneNumber').fill('07466748336');
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function enterAppellantContactDetailsAndContinue(
  I,
  commonContent,
  language
) {
  const postcodeLookupContent =
    language === 'en' ? postcodeLookupContentEn : postcodeLookupContentCy;

  if (postcodeLookupEnabled) {
    await I.locator('#postcodeLookup').fill('xxxxx');
    await I.getByText(postcodeLookupContent.findAddress).click();
    await expect(
      I.getByText(
        postcodeLookupContent.fields.postcodeLookup.error.required
      ).first()
    ).toBeVisible();
    await enterAddressDetails(I, postcodeLookupContent);
  } else {
    await enterAddressDetailsManual(I);
  }
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function enterAppellantContactDetailsAndContinueAfterSignIn(
  I,
  commonContent,
  language
) {
  const postcodeLookupContent =
    language === 'en' ? postcodeLookupContentEn : postcodeLookupContentCy;

  if (postcodeLookupEnabled) {
    await I.locator('#postcodeLookup').fill('xxxxx');
    await I.getByText(postcodeLookupContent.findAddress).click();
    await expect(
      I.getByText(
        postcodeLookupContent.fields.postcodeLookup.error.required
      ).first()
    ).toBeVisible();
    await I.locator('#postcodeLookup').fill('n29ed');
    await I.getByRole('button', { name: commonContent.continue })
      .first()
      .click();
    await expect(
      I.getByText(
        postcodeLookupContent.fields.postcodeAddress.error.required
      ).first()
    ).toBeVisible();
    await enterAddressDetails(I, postcodeLookupContent);
  } else {
    await enterAddressDetailsManual(I);
  }
  await I.getByRole('button', { name: commonContent.saveAndContinue })
    .first()
    .click();
}

async function enterAppellantContactDetailsWithMobileAndContinue(
  I,
  commonContent,
  language,
  mobileNumber = '07466748336'
) {
  const postcodeLookupContent =
    language === 'en' ? postcodeLookupContentEn : postcodeLookupContentCy;

  await expect(
    I.getByText(postcodeLookupContent.textboxLabel).first()
  ).toBeVisible();
  await enterAddressDetails(I, postcodeLookupContent);
  await I.locator('#phoneNumber').fill(mobileNumber);
  await expect(I.getByText(commonContent.continue).first()).toBeEnabled();
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function enterAppellantContactDetailsWithMobileAndContinueAfterSignIn(
  I,
  commonContent,
  language,
  mobileNumber = '07466748336'
) {
  const postcodeLookupContent =
    language === 'en' ? postcodeLookupContentEn : postcodeLookupContentCy;

  await expect(
    I.getByText(postcodeLookupContent.textboxLabel).first()
  ).toBeVisible();
  await enterAddressDetails(I, postcodeLookupContent);
  await I.locator('#phoneNumber').fill(mobileNumber);
  await expect(
    I.getByText(commonContent.saveAndContinue).first()
  ).toBeEnabled();
  await I.getByRole('button', { name: commonContent.saveAndContinue })
    .first()
    .click();
}

async function enterAppellantContactDetailsWithEmailAndContinue(
  I,
  commonContent,
  language
) {
  const postcodeLookupContent =
    language === 'en' ? postcodeLookupContentEn : postcodeLookupContentCy;

  await enterAddressDetails(I, postcodeLookupContent);
  await I.locator('#emailAddress').fill('harry.potter@wizards.com');
  await I.getByRole('button', { name: commonContent.continue }).first().click();
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
