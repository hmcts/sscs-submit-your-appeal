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
  I.wait(5);
  I.dontSee('Edit');
  I.dontSee('Archive');
}

module.exports = { verifyDraftAppealsAndEditACase, verifyDraftAppealsAndArchiveACase };