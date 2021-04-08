const { expect } = require('test/util/chai');
const paths = require('paths');
const proxyquire = require('proxyquire');
const config = require('config');
let Independence = require('steps/start/independence/Independence');

describe('Independence.js', () => {
  let independence = null;
  const steps = {
    steps: {
      HaveAMRN: paths.compliance.haveAMRN,
      CreateAccount: paths.start.createAccount
    }
  };

  describe('benefit type present in session', () => {
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

    it('get is benefit enabled from config', () => {
      expect(independence.isBenefitEnabled('allowUC')).to.equal(config.get('features.allowUC.enabled') === 'true');
    });

    it('returns tribunal panel', () => {
      expect(independence.tribunalPanel).to.equal('judge, doctor and disability expert');
    });

    it('returns benefit type', () => {
      expect(independence.benefitType).to.equal('PIP');
    });

    describe('Disability Living Allowance (DLA)', () => {
      beforeEach(() => {
        independence = new Independence({
          journey: steps,
          session: {
            BenefitType: {
              benefitType: 'Disability Living Allowance (DLA)'
            }
          }
        });
      });

      it('returns tribunal panel', () => {
        expect(independence.tribunalPanel).to.equal('judge, doctor and disability expert');
      });

      it('returns benefit type', () => {
        expect(independence.benefitType).to.equal('DLA');
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

  describe('benefit type not present in session', () => {
    beforeEach(() => {
      independence = new Independence({
        journey: steps,
        session: {}
      });
    });

    it('returns empty string', () => {
      expect(independence.tribunalPanel).to.equal('');
    });

    it('returns benefit type', () => {
      expect(independence.benefitType).to.equal('');
    });
  });
});
