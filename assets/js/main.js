import $ from 'jquery';
import ShowHideContent from 'govuk/show-hide-content';
import accessibleAutocomplete from 'accessible-autocomplete';
import datePicker from './date-picker/date-picker';

function initShowHideContent() {
  const showHideContent = new ShowHideContent();
  showHideContent.init();
}

function initAutocomplete() {
  const selects = document.querySelectorAll('select');
  selects.forEach(select => {
    accessibleAutocomplete.enhanceSelectElement({
      selectElement: select,
      source: (query, populateResults) => {
        const options = Array.from(select.options).map(opt => opt.value);
        const filteredResults = options.filter(opt => opt.match(new RegExp(`^${query}+`, 'i')));
        return populateResults(filteredResults);
      }
    });
  });
}

function initDatePicker() {
  if ($('#date-picker').length) {
    $('.add-another-add-link').hide();
    datePicker.init();
  }
}

$(document).ready(() => {
  initShowHideContent();
  initAutocomplete();
  initDatePicker();
});
