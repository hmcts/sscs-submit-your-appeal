const { expect } = require('test/util/chai');
const paths = require('paths');
const InvalidPostcode = require('steps/start/invalid-postcode/InvalidPostcode');
const urls = require('urls');

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
});
