/* eslint-disable no-process-env */

const language = 'cy';
const signer = require(`test/e2e/data.${language}`).signAndSubmit.signer;
const testDataEn = require('test/e2e/data.en');
const e2eBenefit = require('test/e2e/e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[9].codeWelsh;
const benefitSearch = testDataEn.benefitTypes[9].codeSearchWelsh; // Needed so that the correct benefit type is found when searching.
const hasDwpIssuingOffice = testDataEn.benefitTypes[9].hasDwpIssuingOffice;
const office = testDataEn.benefitTypes[9].office;

test.describe(`${language.toUpperCase()} - JSA E2E SYA - Full Journey`, () => {
  test(`${language.toUpperCase()} - ${benefitCode} E2E SYA Journey @fullFunctional @e2e`, async({ page }) => {
    await e2eBenefit.e2eBenefit(page, benefitSearch, office, signer, language, hasDwpIssuingOffice);
  });
});
