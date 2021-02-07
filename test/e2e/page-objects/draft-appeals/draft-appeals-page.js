const { assert } = require('chai');
const testDataEn = require('test/e2e/data.en');

async function draftAppeals() {
  const I = this;

  I.seeElement(".form-buttons-group [href='/new-appeal']");
  I.see('Your draft benefit appeals');
  I.see('Edit');
  I.see('Archive');

  // check table header values
  const expAppealHeaderValue = await I.grabTextFrom('.govuk-table__header:nth-child(1)');
  const expBenefitHeaderValue = await I.grabTextFrom('.govuk-table__header:nth-child(2)');
  const expMrnHeaderValue = await I.grabTextFrom('.govuk-table__header:nth-child(3)');
  const expActionHeaderValue = await I.grabTextFrom('.govuk-table__header:nth-child(4)');

  assert(expAppealHeaderValue, testDataEn.draftAppeal.idHeader);
  assert(expBenefitHeaderValue, testDataEn.draftAppeal.benefitHeader);
  assert(expMrnHeaderValue, testDataEn.draftAppeal.mrnHeader);
  assert(expActionHeaderValue, testDataEn.draftAppeal.actionsHeader);
}

module.exports = { draftAppeals };