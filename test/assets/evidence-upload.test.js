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


describe('evidence upload', () => {
  let EvidenceUpload;
  let evidenceUpload;
  let $;

  const content = `<div id="evidence-upload">
        <div class="add-another-add-link"></div>
        <dl class="govuk-summary-list">
          <div class="govuk-summary-list__row">
            <dd class="govuk-summary-list__value" id="item-0"></dd>
            <dd class="govuk-summary-list__value" id="item-1"></dd>
          </div>            
        </dl>
        <label for="uploadEv">Label</label>
        <input type="file" id="uploadEv" name="uploadEv"/>
    </div>`;
  const jsdom = new JSDOM(`<body>${content}</body>`);

  const { window } = jsdom;
  const { document } = window;

  before(done => {
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
    $('.govuk-summary-list').append(
      '<dd class="govuk-summary-list__value" id="item-2"></dd>'
    );
    $('.govuk-summary-list').append(
      '<dd class="govuk-summary-list__value" id="item-3"></dd>'
    );
    $('.govuk-summary-list').append(
      '<dd class="govuk-summary-list__value" id="item-5"></dd>'
    );
    const num = evidenceUpload.getNumberForNextItem();
    expect(num).to.equal(4);
  });
  it('#handleInlineError will not append errors if not needed', () => {
    evidenceUpload.handleInlineError([]);
    expect($('.govuk-error-message').length).to.equal(0);
  });
  it('#handleInlineError will append errors if needed', () => {
    evidenceUpload.handleInlineError([
      {
        errors: ['Hugo!']
      }
    ]);
    expect($('form .govuk-error-message').length).to.equal(1);
    $('.govuk-error-message').remove();
  });
  xit('#handleErrorSummary will create the error summary', () => {
    evidenceUpload.handleErrorSummary([
      {
        field: 'uploadEv',
        errors: ['oh dear!']
      }
    ]);
    expect($('.govuk-form-group .govuk-error-message').length).to.equal(1);
  });
  it('#hideUnnecessaryMarkup will do just that', () => {
    expect($('.add-another-add-link')).to.have.$css('display', 'none');
  });
  it('#destroy will remove the additional markup', () => {
    evidenceUpload.destroy();
    expect($('#evidence-upload *').length).to.equal(0);
  });
  it('will submit only if there are items', () => {
    const syntheticEvent = {
      preventDefault: () => {}
    };
    let returnValue;
    sinon.stub(evidenceUpload, 'handleErrorSummary');
    returnValue = evidenceUpload.interceptSubmission(syntheticEvent);
    expect(evidenceUpload.handleErrorSummary).not.to.have.been.called;
    expect(returnValue).to.be.true;
    evidenceUpload.handleErrorSummary.reset();
    $('.govuk-summary-list').empty();
    $('.govuk-summary-list').append('<dl class="noItems"></dl>');
    returnValue = evidenceUpload.interceptSubmission(syntheticEvent);
    expect(returnValue).to.be.false;
    expect(evidenceUpload.handleErrorSummary).to.have.been.called;
    evidenceUpload.handleErrorSummary.restore();
  });
});

/* eslint-enable init-declarations */
/* eslint-enable no-multi-assign */
/* eslint-enable global-require */
/* eslint-enable no-empty-function */
