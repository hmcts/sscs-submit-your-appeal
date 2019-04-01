const { expect } = require('test/util/chai');
const paths = require('paths');
const Independence = require('steps/start/independence/Independence');

describe('Independence.js', () => {
  let independence = null;
  const steps = { steps: { CreateAccount: paths.start.createAccount } };

  beforeEach(() => {
    independence = new Independence({ journey: steps });
  });

  describe('get path()', () => {
    it('returns path /independence', () => {
      expect(independence.path).to.equal(paths.start.independence);
    });
  });

  describe('next()', () => {
    it('returns the next step path /mrn-date', () => {
      expect(independence.next().step).to.eql(paths.start.createAccount);
    });
  });
});
