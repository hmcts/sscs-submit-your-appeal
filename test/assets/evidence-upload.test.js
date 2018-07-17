const chai = require('chai');

const expect = chai.expect;
const jQuery = require('jquery');
const { JSDOM } = require('jsdom');
const chaiAsPromised = require('chai-as-promised');
const chaiJq = require('chai-jq');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(chaiJq);

/* eslint-disable init-declarations */
/* eslint-disable no-multi-assign */
/* eslint-disable global-require */
/* eslint-disable no-empty-function */
/* eslint-disable func-names */

describe('evidence upload', () => {
  let EvidenceUpload;
  let evidenceUpload;
  let $;

  const content = `<div id="evidence-upload">
        <div class="add-another-add-link"></div>
        <dl class="add-another-list">
            <dd class="add-another-list-item" id="item-0"></dd>
            <dd class="add-another-list-item" id="item-1"></dd>
        </dl>
        <label for="uploadEv">Label</label>
        <input type="file" id="uploadEv" name="uploadEv"/>
    </div>`;

  before(done => {
    const jsdom = new JSDOM(`<body>${content}</body>`);

    const { window } = jsdom;
    const { document } = window;
    global.window = window;
    global.document = document;

    $ = global.jQuery = jQuery(window);

    EvidenceUpload = require('assets/js/evidence-upload/evidence-upload').default;
    EvidenceUpload.prototype.doTheUpload = sinon.stub().resolves(true);
    window.setTimeout(done, 10);
  });

  beforeEach(done => {
    $('body').empty();
    $('body').append(content);
    evidenceUpload = new EvidenceUpload('#evidence-upload');
    sinon.stub(evidenceUpload, 'doTheUpload').resolves(true);
    window.setTimeout(done, 10);
  });

  it('it appends the form to the element passed to the constructor', () => {
    expect($('#evidence-upload-form').length).to.equal(1);
  });
  it('#getNumberForNextItem will read the dom and find the next number', () => {
    const num = evidenceUpload.getNumberForNextItem();
    expect(num).to.equal(2);
  });
  it('#getNumberForNextItem will read the dom and find a missing number', () => {
    $('.add-another-list').append('<dd class="add-another-list-item" id="item-2"></dd>');
    $('.add-another-list').append('<dd class="add-another-list-item" id="item-3"></dd>');
    $('.add-another-list').append('<dd class="add-another-list-item" id="item-5"></dd>');
    const num = evidenceUpload.getNumberForNextItem();
    expect(num).to.equal(4);
  });
  it('#handleInlineError will not append errors if not needed', () => {
    evidenceUpload.handleInlineError([]);
    expect($('.error-message').length).to.equal(0);
  });
  it('#handleInlineError will append errors if needed', () => {
    evidenceUpload.handleInlineError([
      {
        errors: ['Hugo!']
      }
    ]);
    expect($('form .error-message').length).to.equal(1);
    $('.error-message').remove();
  });
  xit('#handleErrorSummary will create the error summary', () => {
    evidenceUpload.handleErrorSummary([
      {
        field: 'uploadEv',
        errors: ['oh dear!']
      }
    ]);
    expect($('.form-group .error-message').length).to.equal(1);
  });
  it('#hideUnnecessaryMarkup will do just that', () => {
    expect($('.add-another-add-link')).to.have.$css('display', 'none');
  });
  it('#destroy will remove the additional markup', () => {
    evidenceUpload.destroy();
    expect($('#evidence-upload *').length).to.equal(0);
  });
});

/* eslint-enable init-declarations */
/* eslint-enable no-multi-assign */
/* eslint-enable global-require */
/* eslint-enable no-empty-function */
/* eslint-enable func-names */
