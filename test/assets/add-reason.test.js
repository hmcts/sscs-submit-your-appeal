const chai = require('chai');

const expect = chai.expect;
const jQuery = require('jquery');
const { JSDOM } = require('jsdom');

/* eslint-disable init-declarations */
/* eslint-disable no-multi-assign */
/* eslint-disable global-require */

describe('add reason', () => {
  let AddReason;
  let addReason;
  let $;

  before((done) => {
    const jsdom = new JSDOM(`<body><div id="dynamic-form">
            <ul class="govuk-list"></ul>form goes here</div></body>`);

    const { window } = jsdom;
    const { document } = window;
    global.window = window;
    global.document = document;

    $ = global.jQuery = jQuery(window);
    // cannot be required earlier than here. Sawry!!
    AddReason = require('assets/js/add-reason').default;
    addReason = new AddReason();
    done();
  });

  it('removes add-another on instantiation', () => {
    expect($('govuk-summary-list').length).to.equal(0);
  });

  it('# buildForm adds a dom node for each item', () => {
    addReason.items = [
      {
        'item.whatYouDisagreeWith': 'disagree',
        'item.reasonForAppealing': 'reasons etc'
      },
      {
        'item.whatYouDisagreeWith': 'disagree 2',
        'item.reasonForAppealing': 'reasons etc 2'
      }
    ];
    addReason.buildForm();
    expect($('.items-container').length).to.equal(2);
  });
});

/* eslint-enable init-declarations */
/* eslint-enable no-multi-assign */
/* eslint-enable global-require */
