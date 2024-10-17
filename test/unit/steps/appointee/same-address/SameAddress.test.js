const { expect } = require('test/util/chai');
const SameAddress = require('steps/appointee/same-address/SameAddress');
const i18next = require('i18next');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const sinon = require('sinon');

describe('SameAddress', () => {
  let sameAddress = null;
  const question = 'A Question';

  beforeEach(() => {
    sameAddress = new SameAddress({
      journey: {
        steps: {
          TextReminders: paths.smsNotify.appellantTextReminders,
          AppellantContactDetails: paths.identity.enterAppellantContactDetails
        }
      }
    });

    sameAddress.content = {
      cya: {
        isAddressSameAsAppointee: {
          question,
          yes: 'Yes',
          no: 'No'
        }
      }
    };

    sameAddress.fields = {
      isAddressSameAsAppointee: {}
    };
  });


  describe('iba handler()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('redirect to /does-not-exist called for iba', () => {
      const superStub = sinon.stub(SaveToDraftStore.prototype, 'handler');
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
      sameAddress.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });

    it('no redirect to /does-not-exist called for non iba', () => {
      const superStub = sinon.stub(SaveToDraftStore.prototype, 'handler');
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
      sameAddress.handler(req, res, next);
      expect(res.redirect.called).to.eql(false);
      sinon.assert.calledOnce(superStub);
    });
  });

  describe('English', () => {
    it('should say \'Yes\' when value is yes (English)', () => {
      sameAddress.fields.isAddressSameAsAppointee.value = 'yes';
      const answers = sameAddress.answers();
      expect(answers.answer).to.equal('Yes');
    });

    it('should say \'No\' when value is no (English)', () => {
      sameAddress.fields.isAddressSameAsAppointee.value = 'no';
      const answers = sameAddress.answers();
      expect(answers.answer).to.equal('No');
    });
  });

  describe('Welsh', () => {
    beforeEach(() => {
      i18next.changeLanguage('cy');
    });

    afterEach(() => {
      i18next.changeLanguage('en');
    });

    it('should say \'Ydy\' when value is yes (Welsh)', () => {
      sameAddress.content.cya.isAddressSameAsAppointee.yes = 'Ydy';
      sameAddress.fields.isAddressSameAsAppointee.value = 'yes';
      const answers = sameAddress.answers();
      expect(answers.answer).to.equal('Ydy');
    });

    it('should say \'Nac ydy\' when value is no (Welsh)', () => {
      sameAddress.content.cya.isAddressSameAsAppointee.no = 'Nac ydy';
      sameAddress.fields.isAddressSameAsAppointee.value = 'no';
      const answers = sameAddress.answers();
      expect(answers.answer).to.equal('Nac ydy');
    });
  });

  it('should contain null as the value', () => {
    sameAddress.fields.isAddressSameAsAppointee.value = '';
    const values = sameAddress.values();
    expect(values).to.eql({ appellant: { isAddressSameAsAppointee: null } });
  });

  it('should contain true as the value', () => {
    sameAddress.fields.isAddressSameAsAppointee.value = 'no';
    const values = sameAddress.values();
    expect(values).to.eql({ appellant: { isAddressSameAsAppointee: false } });
  });

  it('should contain false as the value', () => {
    sameAddress.fields.isAddressSameAsAppointee.value = 'yes';
    const values = sameAddress.values();
    expect(values).to.eql({ appellant: { isAddressSameAsAppointee: true } });
  });

  describe('next()', () => {
    it('returns the next step path /appellant-text-reminders for same address', () => {
      sameAddress.fields.isAddressSameAsAppointee.value = 'yes';
      expect(sameAddress.next().step)
        .to.eql(paths.smsNotify.appellantTextReminders);
    });


    it('returns the next step path /enter-appellant-contact-details', () => {
      sameAddress.fields.isAddressSameAsAppointee.value = 'no';
      expect(sameAddress.next().step)
        .to.eql(paths.identity.enterAppellantContactDetails);
    });
  });
});
