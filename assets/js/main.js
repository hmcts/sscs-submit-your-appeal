import $ from 'jquery';
import './polyfill/array-from';
import { remove } from 'lodash';
import { frontend, redis } from '../../config/default';
import ShowHideContent from 'govuk/show-hide-content';
import InactivityAlert from './inactivity-alert';
import accessibleAutocomplete from 'accessible-autocomplete';
import datePicker from './date-picker/date-picker';
import AddReason from './add-reason';
import EvidenceUpload from './evidence-upload/evidence-upload';

/* eslint-disable init-declarations */
let timeoutM;
let evidenceUpload;
/* eslint-enable init-declarations */

/*
  Some selects are not to be enhanced, the following array and function are
  there to manage the exceptions, read discussion on SSCS-3960 for context
*/
const nonEhanceableSelects = ['dwpIssuingOffice', 'title'];

function isNonEhanceableSelect(select) {
  return nonEhanceableSelects.includes(select.id);
}

function initShowHideContent() {
  const showHideContent = new ShowHideContent();
  showHideContent.init();
}


function initAutocomplete() {
  const selects = document.querySelectorAll('select');
  $.each(selects, (index, select) => {
    if (!isNonEhanceableSelect(select)) {
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
    }
  });
}

function doNotSubmitTwice() {
  $('.button').attr('disabled', true);
}

function initDoNotSubmitTwice() {
  if ($('#signer').length) {
    $('form').on('submit', doNotSubmitTwice);
  }
}

function initDatePicker() {
  if ($('#date-picker').length) {
    $('.add-another-add-link').hide();
    $('#date-picker-content').show();
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

function destroyEvidenceUpload() {
  if (evidenceUpload) {
    evidenceUpload.destroy();
    evidenceUpload = null;
  }
}

function initEvidenceUpload() {
  if ($('#evidence-upload').length) {
    evidenceUpload = new EvidenceUpload('#evidence-upload');
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
  initEvidenceUpload();
  initAddReason();
  initDoNotSubmitTwice();
});

$(window).on('unload', () => {
  destroyTM();
  destroyEvidenceUpload();
  if ($('#date-picker').length) {
    $('.prev, .next').off('click');
  }
  if ($('#signer').length) {
    $('form').off('submit', doNotSubmitTwice);
  }
});