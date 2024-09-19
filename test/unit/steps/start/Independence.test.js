/* eslint-disable no-loop-func, guard-for-in */
const { expect } = require('test/util/chai');
const paths = require('paths');
const proxyquire = require('proxyquire');
const i18next = require('i18next');
let Independence = require('steps/start/independence/Independence');
const benefitTypes = require('steps/start/benefit-type/types');

describe('Independence.js', () => {
  let independence = null;
  describe('someBody() check', () => {
    it('Should return IBA if benefit type is IBA', () => {
      independence = new Independence({
        journey: {
          req: {
            session: {
              BenefitType: {
                benefitType: benefitTypes.infectedBloodAppeal
              }
            }
          }
        }
      });
      expect(independence.someBody).to.equal('IBA');
    });

    it('Should return DWP if benefit type is not IBA', () => {
      independence = new Independence({
        journey: {
          req: {
            session: {
              BenefitType: {
                benefitType: benefitTypes.pensionCredit
              }
            }
          }
        }
      });
      expect(independence.someBody).to.equal('DWP');
    });
  });

  describe('benefitCode() check', () => {
    const benefitCodes = Object.keys(benefitTypes);
    const longCodes = ['disabilityLivingAllowance', 'employmentAndSupportAllowance', 'jobseekersAllowance', 'personalIndependencePayment', 'universalCredit'];
    const shortenedCodes = ['DLA', 'ESA', 'JSA', 'PIP', 'UC'];
    for (let i = 0; i < benefitCodes.length; i++) {
      let code = benefitCodes[i];
      it(`Should return correct code for benefit type ${benefitTypes[code]}`, () => {
        independence = new Independence({
          session: {
            BenefitType: {
              benefitType: benefitTypes[code]
            }
          }
        });
        if (longCodes.includes(code)) {
          const index = longCodes.indexOf(code);
          code = shortenedCodes[index];
        }
        expect(independence.benefitCode).to.equal(code);
      });
    }
  });

  describe('benefitEndText() check', () => {
    for (const code in benefitTypes) {
      const benefitType = benefitTypes[code];
      it(`EN - Should return ' benefit' if ${benefitType} doesn't already end in 'benefit'`, () => {
        independence = new Independence({
          session: {
            BenefitType: {
              benefitType
            }
          }
        });
        const lastWord = benefitType.split(' ')[benefitType.split(' ').length - 1];
        if (['Benefit', 'benefit'].includes(lastWord.trim())) {
          expect(independence.benefitEndText).to.equal('');
        } else {
          expect(independence.benefitEndText).to.equal(' benefit');
        }
      });
    }

    for (const code in benefitTypes) {
      const benefitType = benefitTypes[code];
      it(`CY - Should return ' budd-dal' if ${benefitType} doesn't already end in 'benefit'`, () => {
        const MockedIndependence = proxyquire('steps/start/independence/Independence', {
          i18next: {
            language: 'cy'
          }
        });
        independence = new MockedIndependence({
          session: {
            BenefitType: {
              benefitType
            }
          }
        });
        const lastWord = benefitType.split(' ')[benefitType.split(' ').length - 1];
        if (['Benefit', 'benefit'].includes(lastWord.trim())) {
          expect(independence.benefitEndText).to.equal('');
        } else {
          expect(independence.benefitEndText).to.equal('budd-dal ');
        }
      });
    }
  });

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
