const chai = require('chai');

const expect = chai.expect;
const jQuery = require('jquery');
const { JSDOM } = require('jsdom');

/* eslint-disable init-declarations */
/* eslint-disable no-multi-assign */
/* eslint-disable global-require */

describe('postcode lookup', () => {
  let PostCodeLookup;
  let $;
  before(done => {
    const jsdom = new JSDOM(`<div class="govuk-grid-column-two-thirds">
    <h1 class="govuk-heading-l">
    Enter your contact details
    </h1>
    <form enctype="application/x-www-form-urlencoded" action="/enter-appellant-contact-details" method="post" class="form" autocomplete="off">
    <div>
    <p class="govuk-body">These will be used to send you information about your appeal.</p>
    <input type="hidden" id="submitType" name="submitType" value="">    
    <div class="govuk-form-group" "="">
    <label class="govuk-label " for="postcodeLookup">
        Enter a UK postcode
    </label> 
    <input class="govuk-input post-code-lookup" id="postcodeLookup" name="postcodeLookup" type="text">
    <input id="findAddress" class="govuk-button govuk-!-margin-0" type="submit" value="Find address">
    <select name="postcodeAddress" id="postcodeAddress" class="govuk-select govuk-!-width-one-half postcode-address">
    </select>
    </div>
        <div class="govuk-form-group">
            <a id="manualLink" class="govuk-link govuk-body" href="#">I can't enter a UK postcode</a>
        </div>
  <div class="govuk-form-group ">
    <label class="govuk-label " for="phoneNumber">Phone number (optional)</label>
      <span class="govuk-hint">
        This may be used to contact you about your appeal
      </span>
    <input class="govuk-input" id="phoneNumber" name="phoneNumber" type="text">
  </div>
  <div class="govuk-form-group ">
    <label class="govuk-label " for="emailAddress">Email address (optional)</label>
      <span class="govuk-hint">
        You’ll get updates on your appeal and a link so you can track your appeal online
      </span>
    <input class="govuk-input" id="emailAddress" name="emailAddress" type="text">
  </div>
</div>
  <div class="form-buttons-group">
    <input class="govuk-button" type="submit" value="Continue">
  </div>
</form></div>`);

    const { window } = jsdom;
    const { document } = window;
    global.window = window;
    global.document = document;

    $ = global.jQuery = jQuery(window);
    // cannot be required earlier than here. Sawry!!
    PostCodeLookup = require('components/postcodeLookup/assets/main').default;

    done();
  });

  it('manualLinkClickEvent', () => {
    PostCodeLookup.init();
    $('#manualLink').trigger('click');
    expect($('#submitType').val()).to.equal('manual');
  });

  it('findAddress Click', () => {
    PostCodeLookup.init();
    $('#findAddress').trigger('click');
    expect($('#submitType').val()).to.equal('lookup');
  });

  it('postcode-address change', () => {
    PostCodeLookup.init();
    $('.postcode-address').trigger('change');
    expect($('#submitType').val()).to.equal('addressSelection');
  });
});

/* eslint-enable init-declarations */
/* eslint-enable no-multi-assign */
/* eslint-enable global-require */
