const chai = require('chai');
const expect = chai.expect;
const jQuery = require('jquery');
const { JSDOM } = require( 'jsdom' );
const proxyquire = require('proxyquire');


describe('add reason', () => {
  let window;
  let document;
  let AddReason;
  let addReason;
  let $;
  beforeEach((done) => {
    const jsdom = new JSDOM( '<div></div>' );

    const { window } = jsdom;
    const { document } = window;
    global.window = window;
    global.document = document;

    $ = global.jQuery = jQuery(window);
    AddReason = require('assets/js/add-reason').default;
    addReason = new AddReason();
    done()

  });
  it('removes add-another on instantiation', () => {
    expect($('add-another-list').length).to.equal(0);
  });
  it('builds a form on instantiation', () => {

  })
});