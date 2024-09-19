const paths = require('../../../../paths');
const { expect } = require('@playwright/test');
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

async function verifyDraftAppealsAndEditACase(page, language) {
  await expect(page.locator(".form-buttons-group [href='/new-appeal']").first()).toBeVisible();
  if (language === 'en') {
    await expect(page.getByText('Your draft benefit appeals').first()).toBeVisible();
    await expect(page.getByText('Edit').first()).toBeVisible();
    await expect(page.getByText('Archive').first()).toBeVisible();
    scrollTo('.govuk-table__cell:nth-child(page, 1)');
    await page.getByText('Edit').first().click();

    await expect(page.getByText('Check your answers').first()).toBeVisible();
    await expect(page.getByText('Your application is incomplete').first()).toBeVisible();
    await expect(page.getByText('There are still some questions to answer.').first()).toBeVisible();
    await page.getByText('Continue your application').first().click();
  } else {
    await expect(page.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau').first()).toBeVisible();
    await expect(page.getByText('Golygu').first()).toBeVisible();
    await expect(page.getByText('Cadw').first()).toBeVisible();
    scrollTo('.govuk-table__cell:nth-child(page, 1)');
    await page.getByText('Golygu').first().click();

    await expect(page.getByText('Gwiriwch eich atebion').first()).toBeVisible();
    await expect(page.getByText('Mae eich cais yn anghyflawn').first()).toBeVisible();
    await expect(page.getByText('Mae yna gwestiynau nad ydych wedi’u hateb.').first()).toBeVisible();
    await page.getByText('Parhau á’ch cais').first().click();
  }
}

async function verifyDraftAppealsAndArchiveACase(page) {
  await expect(page.locator(".form-buttons-group [href='/new-appeal']").first()).toBeVisible();
  await expect(page.getByText('Your draft benefit appeals').first()).toBeVisible();
  await expect(page.getByText('Edit').first()).toBeVisible();
  await expect(page.getByText('Archive').first()).toBeVisible();
  await page.getByText('Archive').first().click();
  await page.waitForTimeout(1000);
  await expect(page.getByText('Are you sure you want to archive your appeal application?').first()).toBeVisible();
  await page.getByText('Yes').first().click();
  await page.waitForTimeout(2000);
  await page.reload();
  await page.waitForTimeout(2000);
  await expect(page.getByText('Edit')).not.toBeVisible();
  await expect(page.getByText('Archive')).not.toBeVisible();
}

async function editDraftAppeal(page, language) {
  await expect(page.locator(`.form-buttons-group [href='${paths.newAppeal}']`).first()).toBeVisible();
  if (language === 'en') {
    await expect(page.getByText('Your draft benefit appeals').first()).toBeVisible({ timeout: 45000 });
    await expect(page.getByText('Edit').first()).toBeVisible();
    await expect(page.getByText('Archive').first()).toBeVisible();
  } else {
    await expect(page.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau').first()).toBeVisible({ timeout: 45000 });
    await expect(page.getByText('Golygu').first()).toBeVisible();
    await expect(page.getByText('Cadw').first()).toBeVisible();
  }
  const ccdCaseIDs = await page.locator('.govuk-table__cell:nth-child(1)').allTextContents();
  const ccdCaseID = Array.isArray(ccdCaseIDs) ? ccdCaseIDs[0] : ccdCaseIDs;

  await page.getByText(`[href='${paths.editDraft}?caseId=${ccdCaseID}']`).first().click();
  await page.waitForTimeout(2000);
  const url = page.url();
  if (url.includes(paths.drafts)) {
    await page.getByText(`[href='${paths.editDraft}?caseId=${ccdCaseID}']`).first().click();
    if (language === 'en') {
      await expect(page.getByText('Check your answers', 3).first()).toBeVisible({ timeout: 45000 });
    } else {
      await expect(page.getByText('Gwiriwch eich atebion', 3).first()).toBeVisible({ timeout: 45000 });
    }
  }
  return ccdCaseID;
}

async function navigateToDrafts(page, language) {
  await page.goto(`${baseUrl}${paths.drafts}?lng=${language}`);
  await page.locator(`.form-buttons-group [href='${paths.newAppeal}']`).first().waitFor({ timeout: 3000 });
  if (language === 'en') {
    await expect(page.getByText('Your draft benefit appeals').first()).toBeVisible();
  } else {
    await expect(page.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau').first()).toBeVisible();
  }
  await page.waitForTimeout(1000);
}

module.exports = {
  verifyDraftAppealsAndEditACase,
  verifyDraftAppealsAndArchiveACase,
  editDraftAppeal,
  navigateToDrafts
};
