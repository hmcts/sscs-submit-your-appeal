const paths = require('paths');
const { expect } = require('@playwright/test');

async function verifyDraftAppealsAndEditACase(I, language) {
  await expect(
    I.locator(".form-buttons-group [href='/new-appeal']").first()
  ).toBeVisible();
  if (language === 'en') {
    await expect(
      I.getByText('Your draft benefit appeals').first()
    ).toBeVisible();
    await expect(I.getByRole('link', { name: 'Edit' }).first()).toBeVisible();
    await expect(
      I.getByRole('link', { name: 'Archive' }).first()
    ).toBeVisible();
    await I.getByRole('link', { name: 'Edit' }).first().click();

    await expect(I.getByText('Check your answers').first()).toBeVisible();
    await expect(
      I.getByText('Your application is incomplete').first()
    ).toBeVisible();
    await expect(
      I.getByText('There are still some questions to answer.').first()
    ).toBeVisible();
    await I.getByText('Continue your application').first().click();
  } else {
    await expect(
      I.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau').first()
    ).toBeVisible();
    await expect(I.getByText('Golygu').first()).toBeVisible();
    await expect(I.getByText('Dileu').first()).toBeVisible();
    await I.getByText('Golygu').first().click();

    await expect(I.getByText('Gwiriwch eich atebion').first()).toBeVisible();
    await expect(
      I.getByText('Mae eich cais yn anghyflawn').first()
    ).toBeVisible();
    await expect(
      I.getByText('Mae yna gwestiynau nad ydych wedi’u hateb.').first()
    ).toBeVisible();
    await I.getByText('Parhau á’ch cais').first().click();
  }
}

async function verifyDraftAppealsAndArchiveACase(I) {
  await expect(
    I.locator(".form-buttons-group [href='/new-appeal']").first()
  ).toBeVisible();
  await expect(I.getByText('Your draft benefit appeals').first()).toBeVisible();
  await expect(I.getByRole('link', { name: 'Edit' }).first()).toBeVisible();
  await expect(I.getByRole('link', { name: 'Archive' }).first()).toBeVisible();
  await I.getByRole('link', { name: 'Archive' }).first().click();
  await expect(
    I.getByText(
      'Are you sure you want to archive your appeal application?'
    ).first()
  ).toBeVisible();
  await I.getByText('Yes').first().click();
  await I.reload();
  await expect(I.locator('Edit').first()).toBeHidden();
  await expect(I.locator('Archive').first()).toBeHidden();
}

async function editDraftAppeal(I, language) {
  await expect(
    I.locator(`.form-buttons-group [href='${paths.newAppeal}']`).first()
  ).toBeVisible();
  if (language === 'en') {
    await expect(
      I.getByText('Your draft benefit appeals').first()
    ).toBeVisible();
    await expect(I.getByRole('link', { name: 'Edit' }).first()).toBeVisible();
    await expect(
      I.getByRole('link', { name: 'Archive' }).first()
    ).toBeVisible();
  } else {
    await expect(
      I.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau').first()
    ).toBeVisible();
    await expect(I.getByText('Golygu').first()).toBeVisible();
    await expect(I.getByText('Dileu').first()).toBeVisible();
  }

  const ccdCaseIDLocators = await I.locator(
    '.govuk-table__cell:nth-child(1)'
  ).all();
  const ccdCaseIDs = await Promise.all(
    ccdCaseIDLocators.map(locator => locator.innerText())
  );
  const ccdCaseID = Array.isArray(ccdCaseIDs) ? ccdCaseIDs[0] : ccdCaseIDs;

  await I.locator(`[href='${paths.editDraft}?caseId=${ccdCaseID}']`)
    .first()
    .click();
  const url = await I.url();
  if (url.includes(paths.drafts)) {
    await I.locator(`[href='${paths.editDraft}?caseId=${ccdCaseID}']`)
      .first()
      .click();
    if (language === 'en') {
      await expect(I.getByText('Check your answers').first()).toBeVisible();
    } else {
      await expect(I.getByText('Gwiriwch eich atebion').first()).toBeVisible();
    }
  }
  return ccdCaseID;
}

async function navigateToDrafts(I, language) {
  await I.goto(`${paths.drafts}?lng=${language}`);
  await expect(
    I.locator(`.form-buttons-group [href='${paths.newAppeal}']`).first()
  ).toBeVisible();
  if (language === 'en') {
    await expect(
      I.getByText('Your draft benefit appeals').first()
    ).toBeVisible();
  } else {
    await expect(
      I.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau').first()
    ).toBeVisible();
  }
}

module.exports = {
  verifyDraftAppealsAndEditACase,
  verifyDraftAppealsAndArchiveACase,
  editDraftAppeal,
  navigateToDrafts
};
