const config = require('config');

const postcodeLookupEnabled = config.get('postcodeLookup.enabled') === 'true';

function enterRequiredRepresentativeDetailsManual(I) {
  await page.fill('input[name="name.title"]', 'Mr');
  await page.fill('input[name="name.first"]', 'Harry');
  await page.fill('input[name="name.last"]', 'Potter');

  if (postcodeLookupEnabled) {
    await page.click({ id: 'manualLink' });
  }

  await page.fill('#addressLine1', '4 Privet Drive');
  await page.fill('#addressLine2', 'Off Wizards close');
  await page.fill('#county', 'Wizard county');
  await page.fill('#townCity', 'Little Whinging');
  await page.fill('#postCode', 'PA80 5UU');
}

function enterRequiredRepresentativeDetails(I) {
  if (postcodeLookupEnabled) {
    await page.fill('input[name="name.title"]', 'Mr');
    await page.fill('input[name="name.first"]', 'Harry');
    await page.fill('input[name="name.last"]', 'Potter');
    await page.fill({ id: 'postcodeLookup' }, 'PA80 5UU');
    await page.click('Find address');
    selectOption(page, { css: 'form select[name=postcodeAddress]' }, '130075116');
  } else {
    enterRequiredRepresentativeDetailsManual(I);
  }
}

module.exports = { enterRequiredRepresentativeDetails };
