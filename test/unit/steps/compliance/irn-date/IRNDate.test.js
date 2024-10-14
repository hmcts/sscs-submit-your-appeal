const { expect } = require('test/util/chai');
const DateUtils = require('utils/DateUtils');
const IRNDate = require('steps/compliance/irn-date/IRNDate');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const moment = require('moment');
const sinon = require('sinon');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const benefitTypes = require('steps/start/benefit-type/types');


describe('IRNDate.js', () => {
  let irnDate = null;

  beforeEach(() => {
    irnDate = new IRNDate({
      journey: {
        req: {
          session: {
            BenefitType: {
              benefitType: benefitTypes.infectedBloodAppeal
            }
          }
        },
        steps: {
          CheckIRN: paths.compliance.checkIRNDate,
          AppellantName: paths.identity.enterAppellantName
        }
      }
    });

    irnDate.fields = {
      irnDate: {}
    };
  });

  describe('get path()', () => {
    it('returns path /irn-date', () => {
      expect(IRNDate.path).to.equal(paths.compliance.irnDate);
    });
  });
  describe('handler()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('redirect to entry called for iba', () => {
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
      irnDate.handler(req, res, next);
      expect(res.redirect.called).to.eql(false);
      sinon.assert.calledOnce(superStub);
    });
    it('redirect to /does-not-exist called for non iba', () => {
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
      irnDate.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = irnDate.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('irnDate');
    });

    describe('irnDate field', () => {
      beforeEach(() => {
        field = fields.irnDate;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });
    });
  });

  describe('answers() and values()', () => {
    const question = 'A Question';

    beforeEach(() => {
      irnDate.fields = {
        irnDate: {
          value: moment('13-12-2017', 'DD-MM-YYYY')
        }
      };

      irnDate.content = {
        cya: {
          irnDate: {
            question
          }
        }
      };
    });

    it('should contain a single answer', () => {
      const answers = irnDate.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.irnDate);
      expect(answers[0].answer).to.equal('13 December 2017');
    });

    it('should contain a value object', () => {
      const values = irnDate.values();
      const currentDate = moment().format('DD-MM-YYYY');
      expect(values).to.eql({ irn: { date: '13-12-2017', dateAppealSubmitted: currentDate } });
    });
  });

  describe('next()', () => {
    const setIRNDate = date => {
      irnDate.fields.irnDate.value = date;
    };

    describe('when benefit type is IBA', () => {
      it('returns the next step path /enter-appellant-name if date less than a month', () => {
        setIRNDate(DateUtils.oneDayShortOfAMonthAgo());
        expect(irnDate.next().step).to.eql(paths.identity.enterAppellantName);
      });

      it('returns the next step path /enter-appellant-name if date is equal to a month', () => {
        setIRNDate(DateUtils.oneMonthAgo());
        expect(irnDate.next().step).to.eql(paths.identity.enterAppellantName);
      });

      it('returns the next step path /check-irn-date if date is one day over a month', () => {
        setIRNDate(DateUtils.oneMonthAndOneDayAgo());
        expect(irnDate.next().step).to.eql(paths.compliance.checkIRNDate);
      });

      it('returns the next step path /check-irn-date if date is over a year', () => {
        setIRNDate(DateUtils.thirteenMonthsAndOneDayAgo());
        expect(irnDate.next().step).to.eql(paths.compliance.checkIRNDate);
      });
    });

    describe('when date is more than a month ago', () => {
      it('returns the next step path /check-irn-date if date more than a month', () => {
        setIRNDate(DateUtils.oneMonthAndOneDayAgo());
        expect(irnDate.next().step).to.eql(paths.compliance.checkIRNDate);
      });
    });
  });
});
