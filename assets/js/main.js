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
  $.each(selects, (index, select) => {
    accessibleAutocomplete.enhanceSelectElement({
      selectElement: select
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

$(window).on('unload', () => {
  // cautious cleanup -- probably unneeded
  if ($('#date-picker').length) {
    $('.prev, .next').off('click');
  }
});
