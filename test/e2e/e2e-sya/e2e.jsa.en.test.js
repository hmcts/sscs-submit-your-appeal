/* eslint-disable no-process-env */

const language = 'en';
const signer = require(`test/e2e/data.${language}`).signAndSubmit.signer;
const testDataEn = require('test/e2e/data.en');
const e2eBenefit = require('test/e2e/e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[9].code;
const office = testDataEn.benefitTypes[9].office;
const hasDwpIssuingOffice = testDataEn.benefitTypes[9].hasDwpIssuingOffice;

test.describe(`${language.toUpperCase()} - JSA E2E SYA - Full Journey`, () => {
  test(`${language.toUpperCase()} - ${benefitCode} E2E SYA Journey @fullFunctional @e2e`, async({ page }) => {
    await e2eBenefit.e2eBenefit(page, benefitCode, office, signer, language, hasDwpIssuingOffice);
  });
});
