const config = require('config');
const { expect } = require('@playwright/test');

const postcodeLookupEnabled =
  config.get('postcodeLookup.enabled').toString() === 'true';

async function enterRequiredRepresentativeDetailsManual(I) {
  await I.locator('input[name="name.title"]').fill('Mr');
  await I.locator('input[name="name.first"]').fill('Harry');
  await I.locator('input[name="name.last"]').fill('Potter');

  if (postcodeLookupEnabled) {
    await I.locator('#manualLink').first().click();
  }

  await I.locator('#addressLine1').fill('4 Privet Drive');
  await I.locator('#addressLine2').fill('Off Wizards close');
  await I.locator('#county').fill('Wizard county');
  await I.locator('#townCity').fill('Little Whinging');
  await I.locator('#postCode').fill('PA80 5UU');
}

async function enterRequiredRepresentativeDetails(I) {
  if (postcodeLookupEnabled) {
    await I.locator('input[name="name.title"]').fill('Mr');
    await I.locator('input[name="name.first"]').fill('Harry');
    await I.locator('input[name="name.last"]').fill('Potter');
    await I.locator('#postcodeLookup').fill('PA80 5UU');
    await I.getByText('Find address').first().click();
    await I.locator('select[name="postcodeAddress"]').selectOption('130075116');
    await I.waitForURL(new RegExp('.*?validate=1'));
    await expect(I.locator('#addressLine1')).not.toBeEmpty();
  } else {
    await enterRequiredRepresentativeDetailsManual(I);
  }
}

module.exports = { enterRequiredRepresentativeDetails };
