const { expect } = require('test/util/chai');
const { notDefined, defined, ensureArray } = require('lib/vendor/one-per-page/src/util/checks');

describe('util/checks', () => {
  describe('#notDefined', () => {
    it('returns true if undefined', () => {
      expect(notDefined(undefined)).to.be.true;
    });

    it('returns true if null', () => {
      expect(notDefined(null)).to.be.true;
    });

    it('returns false if number', () => {
      expect(notDefined(0)).to.be.false;
    });

    it('returns false if string', () => {
      expect(notDefined('')).to.be.false;
    });

    it('returns false if object', () => {
      expect(notDefined({})).to.be.false;
    });

    it('returns false if function', () => {
      expect(notDefined(() => null)).to.be.false;
    });
  });

  describe('#defined', () => {
    it('returns false if undefined', () => {
      expect(defined(undefined)).to.be.false;
    });

    it('returns false if null', () => {
      expect(defined(null)).to.be.false;
    });

    it('returns true if number', () => {
      expect(defined(0)).to.be.true;
    });

    it('returns true if string', () => {
      expect(defined('')).to.be.true;
    });

    it('returns true if object', () => {
      expect(defined({})).to.be.true;
    });

    it('returns true if function', () => {
      expect(defined(() => null)).to.be.true;
    });
  });

  describe('#ensureArray', () => {
    const obj = 'myObj';

    it('returns the obj wrapped in an array', () => {
      expect(ensureArray(obj)).to.eql([obj]);
    });

    it('returns the given array', () => {
      expect(ensureArray([obj])).to.eql([obj]);
    });
  });
});
