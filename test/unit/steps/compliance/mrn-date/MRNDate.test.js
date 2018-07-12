const { expect } = require('test/util/chai');
const DateUtils = require('utils/DateUtils');
const MRNDate = require('steps/compliance/mrn-date/MRNDate');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const moment = require('moment');

describe('MRNDate.js', () => {
  let mrnDate = null;

  beforeEach(() => {
    mrnDate = new MRNDate({
      journey: {
        steps: {
          AppellantName: paths.identity.enterAppellantName,
          CheckMRN: paths.compliance.checkMRNDate
        }
      }
    });

    mrnDate.fields = {
      mrnDate: {}
    };
  });

  describe('get path()', () => {
    it('returns path /mrn-date', () => {
      expect(MRNDate.path).to.equal(paths.compliance.mrnDate);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = mrnDate.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('mrnDate');
    });

    describe('mrnDate field', () => {
      beforeEach(() => {
        field = fields.mrnDate;
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
      mrnDate.fields = {
        mrnDate: {
          value: moment('13-12-2017', 'DD-MM-YYYY')
        }
      };

      mrnDate.content = {
        cya: {
          mrnDate: {
            question
          }
        }
      };
    });

    it('should contain a single answer', () => {
      const answers = mrnDate.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.mrnDate);
      expect(answers[0].answer).to.equal('13 December 2017');
    });

    it('should contain a value object', () => {
      const values = mrnDate.values();
      const currentDate = moment().format('DD-MM-YYYY');
      expect(values).to.eql({ mrn: { date: '13-12-2017', dateAppealSubmitted: currentDate } });
    });
  });

  describe('next()', () => {
    const setMRNDate = date => {
      mrnDate.fields.mrnDate.value = date;
    };

    it('returns the next step path /enter-appellant-name if date less than a month', () => {
      setMRNDate(DateUtils.oneDayShortOfAMonthAgo());
      expect(mrnDate.next().step).to.eql(paths.identity.enterAppellantName);
    });

    it('returns the next step path /enter-appellant-name if date is equal to a month', () => {
      setMRNDate(DateUtils.oneMonthAgo());
      expect(mrnDate.next().step).to.eql(paths.identity.enterAppellantName);
    });

    it('returns the next step path /check-mrn-date if date more than a month', () => {
      setMRNDate(DateUtils.oneMonthAndOneDayAgo());
      expect(mrnDate.next().step).to.eql(paths.compliance.checkMRNDate);
    });
  });
});
