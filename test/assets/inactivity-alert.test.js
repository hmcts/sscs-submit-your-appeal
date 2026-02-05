const chai = require('chai');

const expect = chai.expect;
const jQuery = require('jquery');
const { JSDOM } = require('jsdom');

/* eslint-disable init-declarations */
/* eslint-disable no-multi-assign */
/* eslint-disable global-require */
/* eslint-disable no-empty-function */
/* eslint-disable func-names */

describe('inactivity alert', () => {
  let InactivityAlert;
  let inactivityAlert;
  let navigatedAway;
  let $;
  const jsdom = new JSDOM(`<body><div id="#timeout-dialog">
      <div id="expiring-in-message">Session expiring in 02:00 minutes</div>
      <button id="extend"></button>
      <button id="destroy"></button>
      </div></body>`);

  const { window } = jsdom;
  const { document } = window;

  beforeEach((done) => {
    global.window = window;
    global.document = document;

    $ = global.jQuery = jQuery(window);

    const mod = function () {};
    mod.close = () => {};

    $.modal = $.fn.modal = $('#timeout-dialog').modal = mod;

    InactivityAlert = require('assets/js/inactivity-alert').default;
    InactivityAlert.navigateAway = () => {
      navigatedAway = true;
    };
    inactivityAlert = new InactivityAlert(10, 5);
    done();
  });

  afterEach(() => {
    inactivityAlert.destroy();
  });

  it('#init starts the countdowns on instantiation', () => {
    expect(inactivityAlert.timeoutForModal).not.to.be.null;
    expect(inactivityAlert.timeoutForSession).not.to.be.null;
  });

  it('restarts the count on click on extend', function (done) {
    let previousTimeout;
    this.timeout(5000);
    // make it wait a bit
    window.setTimeout(() => {
      previousTimeout = inactivityAlert.timeoutForModal;
      $('#extend').trigger('click');
      expect(inactivityAlert.timeoutForModal).not.to.equal(previousTimeout);
      done();
    }, 500);
  });

  it('kills the session on clicking on end', function (done) {
    this.timeout(5000);
    navigatedAway = false;
    $('#destroy').trigger('click');
    expect(navigatedAway).to.be.true;
    done();
  });

  it('when showing it updates the countdown', function (done) {
    this.timeout(10000);
    inactivityAlert.destroy();
    inactivityAlert = new InactivityAlert(3, 1);
    const innerTxt = $('#expiring-in-message').html();
    window.setTimeout(() => {
      const newTxt = $('#expiring-in-message').html();
      expect(innerTxt).not.to.equal(newTxt);
      done();
    }, 2500);
  });
});

/* eslint-enable init-declarations */
/* eslint-enable no-multi-assign */
/* eslint-enable global-require */
/* eslint-enable no-empty-function */
/* eslint-enable func-names */
