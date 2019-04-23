const { expect } = require('test/util/chai');
const paths = require('paths');
const proxyquire = require('proxyquire');

let Independence = proxyquire('steps/start/independence/Independence', {
  config: {
    get: () => 'false'
  }
});

describe('Independence.js', () => {
  let independence = null;
  const steps = {
    steps: {
      HaveAMRN: paths.compliance.haveAMRN,
      CreateAccount: paths.start.createAccount
    }
  };

  beforeEach(() => {
    independence = new Independence({ journey: steps });
  });

  describe('get path()', () => {
    it('returns path /independence', () => {
      expect(independence.path).to.equal(paths.start.independence);
    });
  });

  describe('next()', () => {
    describe('when save and return is DISABLED', () => {
      it('returns the next step path /mrn-date', () => {
        expect(independence.next().step).to.eql(paths.compliance.haveAMRN);
      });
    });

    describe('when save and return is ENABLED', () => {
      beforeEach(() => {
        Independence = proxyquire('steps/start/independence/Independence', {
          config: {
            get: () => 'true'
          }
        });

        independence = new Independence({ journey: steps });
      });

      it('returns the next step path /create-account', () => {
        expect(independence.next().step).to.eql(paths.start.createAccount);
      });
    });
  });
});
