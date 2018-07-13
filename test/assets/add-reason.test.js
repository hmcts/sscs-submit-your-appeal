const chai = require('chai');
const expect = chai.expect;
const jQuery = require('jquery');
const { JSDOM } = require( 'jsdom' );

const AddReason = require('assets/js/add-reason').default;

describe('add reason', () => {
  let window;
  let document;
  let addReason;
  let $;
  beforeEach((done) => {
    const jsdom = new JSDOM( '<div></div>' );

    const { window } = jsdom;
    //window.document = window;
    const { document } = window;
    global.window = window;
    global.document = document;

    $ = global.jQuery = jQuery(window);
    done()
   // addReason = new AddReason();

  });
  it('removes add-another on instantiation', () => {
    expect($('add-another-list').length).to.equal(0);
  });
  it('builds a form on instantiation', () => {

  })
});