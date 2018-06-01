import $ from 'jquery';
import { remove } from 'lodash';
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
        const minQueryLength = 2;
        if (query.length < minQueryLength) {
          return null;
        }
        const options = Array.from(select.options).map(opt => opt.value);
        const startingWithLetter = remove(options, opt =>
          opt.match(new RegExp(`^${query}.+`, 'i')));
        const containingLetter = remove(options, opt =>
          opt.match(new RegExp(`^.+${query}+`, 'i')));
        return populateResults([...startingWithLetter, ...containingLetter]);
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
