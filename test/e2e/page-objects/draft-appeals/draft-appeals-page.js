function verifyDraftAppealsAndEditACase() {
  const I = this;

  I.seeElement(".form-buttons-group [href='/new-appeal']");
  I.see('Your draft benefit appeals');
  I.see('Edit');
  I.see('Archive');
  I.scrollTo('.govuk-table__cell:nth-child(1)');
  I.click('Edit');

  I.see('Check your answers');
  I.see('Your application is incomplete');
  I.see('There are still some questions to answer.');
  I.click('Continue your application');
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