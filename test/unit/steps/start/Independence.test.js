const { expect } = require('test/util/chai');
const paths = require('paths');
const proxyquire = require('proxyquire');
const i18next = require('i18next');
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

    describe('Disability Living Allowance', () => {
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

      beforeEach(() => {
        i18next.changeLanguage('cy');
      });

      afterEach(() => {
        i18next.changeLanguage('en');
      });

      it('returns tribunal panel in Welsh', () => {
        expect(independence.tribunalPanel).to.equal('barnwr, meddyg ac arbenigwr anabledd');
      });
    });

    describe('Attendance Allowance', () => {
      beforeEach(() => {
        independence = new Independence({
          journey: steps,
          session: {
            BenefitType: {
              benefitType: 'Attendance Allowance'
            }
          }
        });
      });

      it('returns tribunal panel', () => {
        expect(independence.tribunalPanel).to.equal('judge, doctor and disability expert');
      });

      it('returns benefit type', () => {
        expect(independence.benefitType).to.equal('Attendance Allowance');
      });
    });

    describe('Attendance Allowance', () => {
      beforeEach(() => {
        independence = new Independence({
          journey: steps,
          session: {
            BenefitType: {
              benefitType: 'Attendance Allowance'
            }
          }
        });
      });

      beforeEach(() => {
        i18next.changeLanguage('cy');
      });

      afterEach(() => {
        i18next.changeLanguage('en');
      });

      it('returns tribunal panel in Welsh', () => {
        expect(independence.tribunalPanel).to.equal('barnwr, meddyg ac arbenigwr anabledd');
      });

      it('returns benefit name in Welsh', () => {
        expect(independence.benefitType).to.equal('Lwfans Gweini');
      });
    });

    describe('Carer\'s Allowance', () => {
      beforeEach(() => {
        independence = new Independence({
          journey: steps,
          session: {
            BenefitType: {
              benefitType: 'Carer\'s Allowance'
            }
          }
        });
      });

      it('returns tribunal panel', () => {
        expect(independence.tribunalPanel).to.equal('judge');
      });

      it('returns benefit type', () => {
        expect(independence.benefitType).to.equal('Carer’s Allowance');
      });
    });

    describe('Carer\'s Allowance', () => {
      beforeEach(() => {
        independence = new Independence({
          journey: steps,
          session: {
            BenefitType: {
              benefitType: 'Carer\'s Allowance'
            }
          }
        });
      });

      beforeEach(() => {
        i18next.changeLanguage('cy');
      });

      afterEach(() => {
        i18next.changeLanguage('en');
      });

      it('returns tribunal panel in Welsh', () => {
        expect(independence.tribunalPanel).to.equal('barnwr');
      });

      it('returns benefit name in Welsh', () => {
        expect(independence.benefitType).to.equal('Lwfans Gofalwr');
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
