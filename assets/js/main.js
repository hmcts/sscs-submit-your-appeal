import $ from 'jquery';
import { frontend } from '../../config/default';
import ShowHideContent from 'govuk/show-hide-content';
import InactivityAlert from './inactivity-alert';
import accessibleAutocomplete from 'accessible-autocomplete';
import Analytics from 'govuk/analytics/analytics';

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

function initTM(showAfterSeconds) {
  const timeoutM = new InactivityAlert(showAfterSeconds);
}

$(document).ready(() => {
  initShowHideContent();
  initAutocomplete();
  initSYAAnalyticsTrack();
  initTM(frontend.inactivityAlert);
});
