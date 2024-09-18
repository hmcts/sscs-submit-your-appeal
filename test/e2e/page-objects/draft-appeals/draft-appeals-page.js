const paths = require('paths');

function verifyDraftAppealsAndEditACase(page, language) {
  

  page.seeElement(".form-buttons-group [href='/new-appeal']");
  if (language === 'en') {
    expect(page.getByText('Your draft benefit appeals')).toBeVisible();
    expect(page.getByText('Edit')).toBeVisible();
    expect(page.getByText('Archive')).toBeVisible();
    scrollTo('.govuk-table__cell:nth-child(page, 1)');
    await page.click('Edit');

    expect(page.getByText('Check your answers')).toBeVisible();
    expect(page.getByText('Your application is incomplete')).toBeVisible();
    expect(page.getByText('There are still some questions to answer.')).toBeVisible();
    await page.click('Continue your application');
  } else {
    expect(page.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau')).toBeVisible();
    expect(page.getByText('Golygu')).toBeVisible();
    expect(page.getByText('Cadw')).toBeVisible();
    scrollTo('.govuk-table__cell:nth-child(page, 1)');
    await page.click('Golygu');

    expect(page.getByText('Gwiriwch eich atebion')).toBeVisible();
    expect(page.getByText('Mae eich cais yn anghyflawn')).toBeVisible();
    expect(page.getByText('Mae yna gwestiynau nad ydych wedi’u hateb.')).toBeVisible();
    await page.click('Parhau á’ch cais');
  }
}

function verifyDraftAppealsAndArchiveACase(page) {
  

  page.seeElement(".form-buttons-group [href='/new-appeal']");
  expect(page.getByText('Your draft benefit appeals')).toBeVisible();
  expect(page.getByText('Edit')).toBeVisible();
  expect(page.getByText('Archive')).toBeVisible();
  scrollTo('.govuk-table__cell:nth-child(page, 1)');
  await page.click('Archive');
  await page.waitForTimeout(1);
  expect(page.getByText('Are you sure you want to archive your appeal application?')).toBeVisible();
  await page.click('Yes');
  await page.waitForTimeout(2);
  page.refreshPage();
  await page.waitForTimeout(2);
  page.dontSee('Edit');
  page.dontSee('Archive');
}

async function editDraftAppeal(language) {
  

  page.seeElement(`.form-buttons-group [href='${paths.newAppeal}']`);
  if (language === 'en') {
    await expect(page.getByText('Your draft benefit appeals')).toBeVisible({ timeout: 45000 })
    expect(page.getByText('Edit')).toBeVisible();
    expect(page.getByText('Archive')).toBeVisible();
    scrollTo('.govuk-table__cell:nth-child(page, 1)');
  } else {
    await expect(page.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau')).toBeVisible({ timeout: 45000 })
    expect(page.getByText('Golygu')).toBeVisible();
    expect(page.getByText('Cadw')).toBeVisible();
    scrollTo('.govuk-table__cell:nth-child(page, 1)');
  }

  const ccdCaseIDs = await grabTextFrom('.govuk-table__cell:nth-child(page, 1)');
  const ccdCaseID = Array.isArray(ccdCaseIDs) ? ccdCaseIDs[0] : ccdCaseIDs;

  await page.click(`[href='${paths.editDraft}?caseId=${ccdCaseID}']`);
  await page.waitForTimeout(2);
  const url = await grabCurrentUrl(page, );
  if (url.includes(paths.drafts)) {
    await page.click(`[href='${paths.editDraft}?caseId=${ccdCaseID}']`);
    if (language === 'en') {
      await expect(page.getByText('Check your answers', 3)).toBeVisible({ timeout: 45000 })
    } else {
      await expect(page.getByText('Gwiriwch eich atebion', 3)).toBeVisible({ timeout: 45000 })
    }
  }
  return ccdCaseID;
}

function navigateToDrafts(language) {
  

  page.goto(`${paths.drafts}?lng=${language}`);
  page.waitForElement(`.form-buttons-group [href='${paths.newAppeal}']`, 3);
  if (language === 'en') {
    expect(page.getByText('Your draft benefit appeals')).toBeVisible();
  } else {
    expect(page.getByText('Drafft o’ch apeliadau ynghylch budd-daliadau')).toBeVisible();
  }
  await page.waitForTimeout(1);
}

module.exports = {
  verifyDraftAppealsAndEditACase,
  verifyDraftAppealsAndArchiveACase,
  editDraftAppeal,
  navigateToDrafts,
};
