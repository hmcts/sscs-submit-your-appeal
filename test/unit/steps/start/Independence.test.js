const { expect } = require('test/util/chai');
const paths = require('paths');
const proxyquire = require('proxyquire');
const config = require('config');
const checkWelshToggle = require('middleware/checkWelshToggle');
let Independence = require('steps/start/independence/Independence');

describe('Independence.js', () => {
  let independence = null;
  const steps = {
    steps: {
      HaveAMRN: paths.compliance.haveAMRN,
      CreateAccount: paths.start.createAccount
    }
  };

  beforeEach(() => {
    independence = new Independence({
      journey: steps,
      session: {
        BenefitType: {
          benefitType: 'Personal Independence Payment (PIP)'
        }
      }
    });
  });

  it('returns path /independence', () => {
    expect(independence.path).to.equal(paths.start.independence);
  });

  it('get allowUC from config', () => {
    expect(independence.allowUC).to.equal(config.get('features.allowUC.enabled') === 'true');
  });

  it('returns tribunal panel', () => {
    expect(independence.tribunalPanel).to.equal('judge, doctor and disability expert');
  });

  it('returns benefit type', () => {
    expect(independence.benefitType).to.equal('PIP');
  });

  describe('get middleware()', () => {
    it('returns correct middleware array', () => {
      expect(independence.middleware).to.be.an('array');
      expect(independence.middleware).to.have.length(6);
      expect(independence.middleware[0]).to.equal(checkWelshToggle);
    });
  });

  describe('next()', () => {
    describe('when save and return is DISABLED', () => {
      beforeEach(() => {
        Independence = proxyquire('steps/start/independence/Independence', {
          config: {
            get: () => 'false'
          }
        });

        independence = new Independence({ journey: steps });
      });
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
