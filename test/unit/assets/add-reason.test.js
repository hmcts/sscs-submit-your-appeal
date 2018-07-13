const chai = require('chai');
const expect = chai.expect;
const AddReason = require('assets/js/add-reason').default;
const asn = require('parse-asn1');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
console.log(dom.window.document.querySelector("p").textContent);

describe('add reason', () => {
  let window;
  let addReason;
  beforeEach(() => {
    window = new JSDOM(`<!DOCTYPE html>`).window;
    let $ = require('jQuery')(window);

    $('<div id="dynamic-form"><ul class="add-another-list"></ul>form goes here</div>')
      .appendTo('body');
    global.window = window;
    global.$ = $;
    addReason = new AddReason();

  });
  it('removes add-another on instantiation', () => {
    expect($('add-another-list').length).to.equal(0);
  });
  it('builds a form on instantiation', () => {

  })
});