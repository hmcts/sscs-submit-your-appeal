const { expect } = require('test/util/chai');
const paths = require('paths');
const InvalidPostcode = require('steps/start/invalid-postcode/InvalidPostcode');
const urls = require('urls');
const checkWelshToggle = require('middleware/checkWelshToggle');

describe('InvalidPostcode.js', () => {
  let invalidPostcode = null;

  beforeEach(() => {
    invalidPostcode = new InvalidPostcode({ journey: {} });
  });

  describe('get path()', () => {
    it('returns path /invalid-postcode', () => {
      expect(invalidPostcode.path).to.equal(paths.start.invalidPostcode);
    });
  });

  describe('get formUrl()', () => {
    it('returns correct form ul', () => {
      expect(invalidPostcode.formUrl).to.equal(urls.formDownload.sscs1);
    });
  });

  describe('get middleware()', () => {
    it('returns correct middleware array', () => {
      expect(invalidPostcode.middleware).to.be.an('array');
      expect(invalidPostcode.middleware).to.have.length(6);
      expect(invalidPostcode.middleware[0]).to.equal(checkWelshToggle);
    });
  });
});
