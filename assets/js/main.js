import $ from 'jquery';
import { frontend, redis } from '../../config/default';
import ShowHideContent from 'govuk/show-hide-content';
import InactivityAlert from './inactivity-alert';
import accessibleAutocomplete from 'accessible-autocomplete';
import datePicker from './date-picker/date-picker';
import Analytics from 'govuk/analytics/analytics';

/* eslint-disable init-declarations */
let timeoutM;
/* eslint-enable init-declarations */


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

function initDatePicker() {
  if ($('#date-picker').length) {
    $('.add-another-add-link').hide();
    datePicker.init();
  }
}

function initSYAAnalyticsTrack() {
  Analytics.load();

  // Use document.domain in dev, preview and staging so that tracking works
  // Otherwise explicitly set the domain as www.gov.uk (and not gov.uk).
  const cookieDomain = (document.domain === 'www.gov.uk') ? '.www.gov.uk' : document.domain;

  window.GOVUK.analytics = new Analytics({
    universalId: 'UA-91309785-4',
    cookieDomain
  });

  // Set custom dimensions before tracking pageviews
  // analytics.setDimension(…)

  // Activate any event plugins eg. print intent, error tracking
  // analyticsPlugins.error();
  // analyticsPlugins.printIntent();

  // Track initial pageview
  window.GOVUK.analytics.trackPageview();
}

function initTM(sessionSeconds, showAfterSeconds) {
  timeoutM = new InactivityAlert(sessionSeconds, showAfterSeconds);
}

function destroyTM() {
  if (timeoutM) {
    timeoutM.destroy();
  }
}

$(document).ready(() => {
  initShowHideContent();
  initAutocomplete();
  initSYAAnalyticsTrack();
  initTM(redis.timeout, frontend.inactivityAlert);
  initDatePicker();
});

$(window).on('unload', () => {
  destroyTM();
});