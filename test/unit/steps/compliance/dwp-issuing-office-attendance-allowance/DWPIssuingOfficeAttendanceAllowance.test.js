const { expect } = require('test/util/chai');
const DWPIssuingOfficeAttendanceAllowance = require('steps/compliance/dwp-issuing-office-attendance-allowance/DWPIssuingOfficeAttendanceAllowance');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');

describe('DWPIssuingOfficeAttendanceAllowance.js', () => {
  let dwpIssuingOfficeAttendanceAllowance = null;

  beforeEach(() => {
    dwpIssuingOfficeAttendanceAllowance = new DWPIssuingOfficeAttendanceAllowance({
      journey: {
        steps: {
          Appointee: paths.identity.areYouAnAppointee
        },
        req: {
          session: {
            BenefitType: {
              benefitType: benefitTypes.attendanceAllowance
            }
          }
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /dwp-issuing-office', () => {
      expect(dwpIssuingOfficeAttendanceAllowance.path).to.equal(paths.compliance.dwpIssuingOfficeAttendanceAllowance);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = dwpIssuingOfficeAttendanceAllowance.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('dwpIssuingOffice');
    });

    describe('dwpIssuingOffice field', () => {
      beforeEach(() => {
        field = fields.dwpIssuingOffice;
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
      dwpIssuingOfficeAttendanceAllowance.fields = {
        dwpIssuingOffice: {
          value: 'Office name'
        }
      };

      dwpIssuingOfficeAttendanceAllowance.content = {
        cya: {
          dwpIssuingOffice: {
            question
          }
        }
      };
    });

    it('should contain a single answer', () => {
      const answers = dwpIssuingOfficeAttendanceAllowance.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.mrnDate);
      expect(answers[0].answer).to.equal('Office name');
    });

    it('should contain a value object', () => {
      const values = dwpIssuingOfficeAttendanceAllowance.values();
      expect(values).to.eql({ mrn: { dwpIssuingOffice: 'Office name' } });
    });
  });

  describe('next()', () => {
    it('returns the next step path /are-you-an-appointee', () => {
      expect(dwpIssuingOfficeAttendanceAllowance.next()).to.eql({ nextStep: paths.identity.areYouAnAppointee });
    });
  });

  describe('options', () => {
    it('has options for Attendance Allowance', () => {
      expect(dwpIssuingOfficeAttendanceAllowance.options.length).to.eql(2);
      expect(dwpIssuingOfficeAttendanceAllowance.options[0].label).to.eql('The Pension Service 11');
      expect(dwpIssuingOfficeAttendanceAllowance.options[1].label).to.eql('Recovery from Estates');
    });
  });
});
