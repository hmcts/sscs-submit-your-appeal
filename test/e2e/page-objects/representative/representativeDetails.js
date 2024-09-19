const config = require('config');

const postcodeLookupEnabled = config.get('postcodeLookup.enabled') === 'true';

async function enterRequiredRepresentativeDetailsManual(page) {
  await page.fill('input[name="name.title"]', 'Mr');
  await page.fill('input[name="name.first"]', 'Harry');
  await page.fill('input[name="name.last"]', 'Potter');

  if (postcodeLookupEnabled) {
    await page.locator('#manualLink').first().click();
  }

  await page.fill('#addressLine1', '4 Privet Drive');
  await page.fill('#addressLine2', 'Off Wizards close');
  await page.fill('#county', 'Wizard county');
  await page.fill('#townCity', 'Little Whinging');
  await page.fill('#postCode', 'PA80 5UU');
}

async function enterRequiredRepresentativeDetails(page) {
  if (postcodeLookupEnabled) {
    await page.fill('input[name="name.title"]', 'Mr');
    await page.fill('input[name="name.first"]', 'Harry');
    await page.fill('input[name="name.last"]', 'Potter');
    await page.fill('#postcodeLookup', 'PA80 5UU');
    await page.getByText('Find address').first().click();
    await page.selectOption('form select[name=postcodeAddress]', '130075116');
  } else {
    await enterRequiredRepresentativeDetailsManual(page);
  }
}

module.exports = { enterRequiredRepresentativeDetails };
