import $ from 'jquery';
import ShowHideContent from 'govuk/show-hide-content';
import accessibleAutocomplete from 'accessible-autocomplete';

function initShowHideContent() {
  const showHideContent = new ShowHideContent();
  showHideContent.init();
}

function initAutocomplete() {
  const selects = document.querySelectorAll('select');
  selects.forEach(select => {
    accessibleAutocomplete.enhanceSelectElement({
      selectElement: select
    });
  });
}

$(document).ready(() => {
  initShowHideContent();
  initAutocomplete();
});
