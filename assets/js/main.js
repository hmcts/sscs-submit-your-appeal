import $ from 'jquery';
import ShowHideContent from 'govuk/show-hide-content';
import accessibleAutocomplete from 'accessible-autocomplete';
import Analytics from 'govuk/analytics/analytics';
import datePicker from './date-picker';

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
