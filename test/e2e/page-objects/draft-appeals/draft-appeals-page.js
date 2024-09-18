const paths = require('paths');
const { expect } = require('@playwright/test');

async function verifyDraftAppealsAndEditACase(page, language) {
  await expect(page.locator(".form-buttons-group [href='/new-appeal']").first()).toBeVisible();
  if (language === 'en') {
    await expect(page.getByText('Your draft benefit appeals')).toBeVisible();
    await expect(page.getByText('Edit')).toBeVisible();
    await expect(page.getByText('Archive')).toBeVisible();
    scrollTo('.govuk-table__cell:nth-child(page, 1)');
    await page.click('Edit');

    await expect(page.getByText('Check your answers')).toBeVisible();
    await expect(page.getByText('Your application is incomplete')).toBeVisible();
    await expect(page.getByText('There are still some questions to answer.')).toBeVisible();
    await page.click('Continue your application');
  } else {
    await expect(page.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau')).toBeVisible();
    await expect(page.getByText('Golygu')).toBeVisible();
    await expect(page.getByText('Cadw')).toBeVisible();
    scrollTo('.govuk-table__cell:nth-child(page, 1)');
    await page.click('Golygu');

    await expect(page.getByText('Gwiriwch eich atebion')).toBeVisible();
    await expect(page.getByText('Mae eich cais yn anghyflawn')).toBeVisible();
    await expect(page.getByText('Mae yna gwestiynau nad ydych wedi’u hateb.')).toBeVisible();
    await page.click('Parhau á’ch cais');
  }
}

async function verifyDraftAppealsAndArchiveACase(page) {
  await expect(page.locator(".form-buttons-group [href='/new-appeal']").first()).toBeVisible();
  await expect(page.getByText('Your draft benefit appeals')).toBeVisible();
  await expect(page.getByText('Edit')).toBeVisible();
  await expect(page.getByText('Archive')).toBeVisible();
  await page.click('Archive');
  await page.waitForTimeout(1000);
  await expect(page.getByText('Are you sure you want to archive your appeal application?')).toBeVisible();
  await page.click('Yes');
  await page.waitForTimeout(2000);
  await page.reload();
  await page.waitForTimeout(2000);
  await expect(page.getByText('Edit')).not.toBeVisible();
  await expect(page.getByText('Archive')).not.toBeVisible();
}

async function editDraftAppeal(page, language) {
  await expect(page.locator(`.form-buttons-group [href='${paths.newAppeal}']`).first()).toBeVisible();
  if (language === 'en') {
    await expect(page.getByText('Your draft benefit appeals')).toBeVisible({ timeout: 45000 });
    await expect(page.getByText('Edit')).toBeVisible();
    await expect(page.getByText('Archive')).toBeVisible();
  } else {
    await expect(page.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau')).toBeVisible({ timeout: 45000 });
    await expect(page.getByText('Golygu')).toBeVisible();
    await expect(page.getByText('Cadw')).toBeVisible();
  }
  const ccdCaseIDs = await page.locator('.govuk-table__cell:nth-child(1)').allTextContents();
  const ccdCaseID = Array.isArray(ccdCaseIDs) ? ccdCaseIDs[0] : ccdCaseIDs;

  await page.click(`[href='${paths.editDraft}?caseId=${ccdCaseID}']`);
  await page.waitForTimeout(2000);
  const url = page.url();
  if (url.includes(paths.drafts)) {
    await page.click(`[href='${paths.editDraft}?caseId=${ccdCaseID}']`);
    if (language === 'en') {
      await expect(page.getByText('Check your answers', 3)).toBeVisible({ timeout: 45000 });
    } else {
      await expect(page.getByText('Gwiriwch eich atebion', 3)).toBeVisible({ timeout: 45000 });
    }
  }
  return ccdCaseID;
}

async function navigateToDrafts(page, language) {
  await page.goto(`${paths.drafts}?lng=${language}`);
  await page.locator(`.form-buttons-group [href='${paths.newAppeal}']`).first().waitFor({ timeout: 3000 });
  if (language === 'en') {
    await expect(page.getByText('Your draft benefit appeals')).toBeVisible();
  } else {
    await expect(page.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau')).toBeVisible();
  }
  await page.waitForTimeout(1000);
}

module.exports = {
  verifyDraftAppealsAndEditACase,
  verifyDraftAppealsAndArchiveACase,
  editDraftAppeal,
  navigateToDrafts
};
