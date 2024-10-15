const { expect } = require('test/util/chai');
const ContactDWP = require('steps/compliance/contact-dwp/ContactDWP');
const paths = require('paths');
const sinon = require('sinon');
const benefitTypes = require('steps/start/benefit-type/types');
const { ExitPoint } = require('@hmcts/one-per-page');

describe('ContactDWP.js', () => {
  let contactDWP = null;

  describe('Benefit type present in session', () => {
    beforeEach(() => {
      contactDWP = new ContactDWP({
        journey: {
          steps: {}
        },
        session: {
          BenefitType: {
            benefitType: 'Universal Credit (UC) Universal Credit UC'
          }
        }
      });
    });

    it('returns path /contact-dwp', () => {
      expect(ContactDWP.path).to.equal(paths.compliance.contactDWP);
    });


    describe('handler()', () => {
      afterEach(() => {
        sinon.restore();
      });

      it('no redirect to /does-not-exist called for non iba', () => {
        const superStub = sinon.stub(ExitPoint.prototype, 'handler');
        const req = {
          method: 'GET',
          session: {
            BenefitType: {
              benefitType: benefitTypes.nationalInsuranceCredits
            }
          }
        };
        const res = {
          redirect: sinon.spy()
        };
        const next = sinon.spy();
        contactDWP.handler(req, res, next);
        expect(res.redirect.called).to.eql(false);
        sinon.assert.calledOnce(superStub);
      });
      it('redirect to /does-not-exist called for iba', () => {
        const superStub = sinon.stub(ExitPoint.prototype, 'handler');
        const req = {
          method: 'GET',
          session: {
            BenefitType: {
              benefitType: benefitTypes.infectedBloodAppeal
            }
          }
        };
        const res = {
          redirect: sinon.spy()
        };
        const next = sinon.spy();
        contactDWP.handler(req, res, next);
        expect(res.redirect.called).to.eql(true);
        expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
        sinon.assert.notCalled(superStub);
      });
    });

    it('get benefitType returns a benefit type when present in the session', () => {
      expect(contactDWP.benefitType).to.equal('UC Universal Credit UC');
    });
  });

  describe('Benefit type not present in session', () => {
    it('get benefitType returns a benefit type when present in the session', () => {
      contactDWP = new ContactDWP({
        journey: {
          steps: {}
        },
        session: {}
      });

      expect(contactDWP.benefitType).to.equal('');
    });
  });
});
