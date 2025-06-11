import * as $ from 'jquery';
import './polyfill/array-from';
import { remove } from 'lodash-es';
import './cookie';
import { frontend, redis } from '../../config/default';
import { ShowHideContent } from './show-hide-content';
import InactivityAlert from './inactivity-alert';
import accessibleAutocomplete from 'accessible-autocomplete';
import datePicker from './date-picker/date-picker';
import AddReason from './add-reason';
import EvidenceUpload from './evidence-upload/evidence-upload';
import CheckCookies from './check-cookies';
import PostCodeLookup from '../../components/postcodeLookup/assets/main';
import { WebChat } from './web-chat';
import { WebChatScotland } from './web-chat-scotland';
import DeleteWarning from './delete-warning';
import LanguagePreferenceToggle from './language-preference';

/* eslint-disable init-declarations */
let timeoutM;
let deleteM;
let evidenceUpload;
/* eslint-enable init-declarations */

/*
  Some selects are not to be enhanced, the following array and function are
  there to manage the exceptions, read discussion on SSCS-3960 for context
*/
const nonEhanceableSelects = [
  'dwpIssuingOffice',
  'title',
  'postcodeAddress',
  'pipNumber'
];

function isNonEhanceableSelect(select) {
  return nonEhanceableSelects.includes(select.id);
}

function initShowHideContent() {
  const showHideContent = new ShowHideContent();
  showHideContent.init();
}

function initWebChat(language) {
  if (document.welshWebchatFlag) {
    const webChat = new WebChat();
    webChat.init();
  } else if (language === 'en' && $('#antenna-web-chat').length) {
    const webChat = new WebChat();
    webChat.init();
  }
}

function initWebChatScotland() {
  const webChatScotland = new WebChatScotland();
  webChatScotland.init();
}
function initCookieBanner() {
  if ($('#app-cookie-banner').length) {
    const checkCookies = new CheckCookies();
    checkCookies.init();
  }
}

function initAutocomplete() {
  const selects = document.querySelectorAll('select');
  $.each(selects, (index, select) => {
    if (!isNonEhanceableSelect(select)) {
      accessibleAutocomplete.enhanceSelectElement({
        selectElement: select,
        source: (query, populateResults) => {
          const minQueryLength = 1;
          const alphaNumeric = /^[a-z0-9]+$/i;
          if (query.length < minQueryLength || !query.match(alphaNumeric)) {
            return null;
          }

          const options = Array.from(select.options).map(opt => opt.label);

          const startingWithLetter = remove(options, opt =>
            opt.match(new RegExp(`^${query}.+`, 'i'))
          );
          const containingLetter = remove(options, opt =>
            opt.match(new RegExp(`${query}`, 'i'))
          );
          return populateResults([...startingWithLetter, ...containingLetter]);
        }
      });
    }
  });
}

function doNotSubmitTwice() {
  $('.govuk-button').attr('disabled', true);
}

function initDoNotSubmitTwice() {
  $('form').on('submit', doNotSubmitTwice);
}

function initDatePicker(language) {
  if ($('#date-picker').length) {
    $('.add-another-add-link').hide();
    $('#date-picker-content').show();
    datePicker.init(language);
  }
}

function hasMetaRefresh() {
  // document.querySelectorAll('noscript meta') doesn't work! :-o
  const noscripts = document.querySelectorAll('noscript');
  return Array.from(noscripts).some(
    el => el.innerHTML.indexOf('refresh') !== -1
  );
}

function initTM(sessionSeconds, showAfterSeconds) {
  if (hasMetaRefresh()) {
    timeoutM = new InactivityAlert(sessionSeconds, showAfterSeconds);
  }
}

function initDeleteWarning() {
  deleteM = new DeleteWarning();
}

function destroyTM() {
  if (timeoutM) {
    timeoutM.destroy();
  }
}

function destroyAM() {
  if (deleteM) {
    deleteM.destroy();
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

function initBackButton() {
  $('.govuk-back-link').click(() => {
    history.go(-1);
    return false;
  });
}

function initLanguagePreferenceToggle() {
  if (LanguagePreferenceToggle.startLanguagePreferenceToggle()) new LanguagePreferenceToggle();
}

function initGovUkComponentJavascript() {
  const govUK = require('govuk-frontend');

  govUK.initAll();
}

$(document).ready(() => {
  const language = $('html').attr('lang');
  initShowHideContent();
  initAutocomplete();
  initTM(redis.timeout, frontend.inactivityAlert);
  initDatePicker(language);
  initEvidenceUpload();
  initAddReason();
  initDoNotSubmitTwice();
  initBackButton();
  initWebChat(language);
  initDeleteWarning();
  PostCodeLookup.init();
  initCookieBanner();
  initWebChatScotland();
  initLanguagePreferenceToggle();
  initGovUkComponentJavascript();
});

$(window).on('unload', () => {
  destroyTM();
  destroyAM();
  destroyEvidenceUpload();
  if ($('#date-picker').length) {
    $('.prev, .next').off('click');
  }
  if ($('#signer').length) {
    $('form').off('submit', doNotSubmitTwice);
  }
});
