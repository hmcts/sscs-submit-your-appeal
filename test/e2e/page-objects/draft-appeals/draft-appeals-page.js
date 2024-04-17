const paths = require('paths');

function verifyDraftAppealsAndEditACase(language) {
  const I = this;

  I.seeElement(".form-buttons-group [href='/new-appeal']");
  if (language === 'en') {
    I.see('Your draft benefit appeals');
    I.see('Edit');
    I.see('Archive');
    I.scrollTo('.govuk-table__cell:nth-child(1)');
    I.click('Edit');

    I.see('Check your answers');
    I.see('Your application is incomplete');
    I.see('There are still some questions to answer.');
    I.click('Continue your application');
  } else {
    I.see('Drafft o’ch apeliadau ynghylch budd-daliadau');
    I.see('Golygu');
    I.see('Cadw');
    I.scrollTo('.govuk-table__cell:nth-child(1)');
    I.click('Golygu');

    I.see('Gwiriwch eich atebion');
    I.see('Mae eich cais yn anghyflawn');
    I.see('Mae yna gwestiynau nad ydych wedi’u hateb.');
    I.click('Parhau á’ch cais');
  }
}

function verifyDraftAppealsAndArchiveACase() {
  const I = this;

  I.seeElement(".form-buttons-group [href='/new-appeal']");
  I.see('Your draft benefit appeals');
  I.see('Edit');
  I.see('Archive');
  I.scrollTo('.govuk-table__cell:nth-child(1)');
  I.click('Archive');
  I.wait(1);
  I.see('Are you sure you want to archive your appeal application?');
  I.click('Yes');
  I.wait(2);
  I.refreshPage();
  I.wait(2);
  I.dontSee('Edit');
  I.dontSee('Archive');
}

async function editDraftAppeal(language) {
  const I = this;

  I.seeElement(`.form-buttons-group [href='${paths.newAppeal}']`);
  if (language === 'en') {
    I.waitForText('Your draft benefit appeals');
    I.see('Edit');
    I.see('Archive');
    I.scrollTo('.govuk-table__cell:nth-child(1)');
  } else {
    I.waitForText('Drafft o’ch apeliadau ynghylch budd-daliadau');
    I.see('Golygu');
    I.see('Cadw');
    I.scrollTo('.govuk-table__cell:nth-child(1)');
  }

  const ccdCaseIDs = await I.grabTextFrom('.govuk-table__cell:nth-child(1)');
  const ccdCaseID = Array.isArray(ccdCaseIDs) ? ccdCaseIDs[0] : ccdCaseIDs;

  I.click(`[href='${paths.editDraft}?caseId=${ccdCaseID}']`);
  I.wait(2);
  const url = await I.grabCurrentUrl();
  if (url.includes(paths.drafts)) {
    I.click(`[href='${paths.editDraft}?caseId=${ccdCaseID}']`);
    if (language === 'en') {
      I.waitForText('Check your answers', 3);
    } else {
      I.waitForText('Gwiriwch eich atebion', 3);
    }
  }
  return ccdCaseID;
}


function navigateToDrafts(language) {
  const I = this;

  I.amOnPage(`${paths.drafts}?lng=${language}`);
  I.waitForElement(`.form-buttons-group [href='${paths.newAppeal}']`, 3);
  if (language === 'en') {
    I.see('Your draft benefit appeals');
  } else {
    I.see('Drafft o’ch apeliadau ynghylch budd-daliadau');
  }
  I.wait(1);
}

module.exports = { verifyDraftAppealsAndEditACase, verifyDraftAppealsAndArchiveACase, editDraftAppeal, navigateToDrafts };
