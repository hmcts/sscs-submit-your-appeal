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

  before(done => {
    const jsdom = new JSDOM(`<body><div id="#timeout-dialog">
        <button id="extend"></button>
        <button id="destroy"></button>
        </div></body>`);

    const { window } = jsdom;
    const { document } = window;
    global.window = window;
    global.document = document;

    $ = global.jQuery = jQuery(window);

    const mod = function() {};
    mod.close = () => {};

    $.modal = $.fn.modal = $('#timeout-dialog').modal = mod;

    InactivityAlert = require('assets/js/inactivity-alert').default;
    InactivityAlert.navigateAway = () => {
      navigatedAway = true;
    };
    inactivityAlert = new InactivityAlert();
    done();
  });

  it('#init starts the countdowns on instantiation', () => {
    expect(inactivityAlert.timeoutForModal).not.to.be.null;
    expect(inactivityAlert.timeoutForSession).not.to.be.null;
  });
  it('restarts the count on click on extend', function(done) {
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
  it('kills the session on clicking on end', function(done) {
    this.timeout(5000);
    navigatedAway = false;
    $('#destroy').trigger('click');
    expect(navigatedAway).to.be.true;
    done();
  });
});

/* eslint-enable init-declarations */
/* eslint-enable no-multi-assign */
/* eslint-enable global-require */
/* eslint-enable no-empty-function */
/* eslint-enable func-names */
