import $ from 'jquery';
import { remove } from 'lodash';
import { frontend, redis } from '../../config/default';
import ShowHideContent from 'govuk/show-hide-content';
import InactivityAlert from './inactivity-alert';
import accessibleAutocomplete from 'accessible-autocomplete';
import datePicker from './date-picker/date-picker';
import AddReason from './add-reason';

/* eslint-disable init-declarations */
let timeoutM;
/* eslint-enable init-declarations */


function initShowHideContent() {
  const showHideContent = new ShowHideContent();
  showHideContent.init();
}

function initAutocomplete() {
  const selects = document.querySelectorAll('select');
  $.each(selects, (index, select) => {
    accessibleAutocomplete.enhanceSelectElement({
      selectElement: select,
      source: (query, populateResults) => {
        const minQueryLength = 1;
        if (query.length < minQueryLength) {
          return null;
        }
        const options = Array.from(select.options).map(opt => opt.value);
        const startingWithLetter = remove(options, opt =>
          opt.match(new RegExp(`^${query}.+`, 'i')));
        const containingLetter = remove(options, opt =>
          opt.match(new RegExp(`^.*${query}*`, 'i')));
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

function hasMetaRefresh() {
  // document.querySelectorAll('noscript meta') doesn't work! :-o
  const noscripts = document.querySelectorAll('noscript');
  return Array.from(noscripts).some(el => el.innerHTML.indexOf('refresh') !== -1);
}

function initTM(sessionSeconds, showAfterSeconds) {
  if (hasMetaRefresh()) {
    timeoutM = new InactivityAlert(sessionSeconds, showAfterSeconds);
  }
}

function destroyTM() {
  if (timeoutM) {
    timeoutM.destroy();
  }
}

function initAddReason() {
  if (AddReason.startAddReason()) {
    /* eslint-disable no-new */
    new AddReason();
  }
}

$(document).ready(() => {
  initShowHideContent();
  initAutocomplete();
  initTM(redis.timeout, frontend.inactivityAlert);
  initDatePicker();
  initAddReason();
});

$(window).on('unload', () => {
  destroyTM();
  if ($('#date-picker').length) {
    $('.prev, .next').off('click');
  }
});
