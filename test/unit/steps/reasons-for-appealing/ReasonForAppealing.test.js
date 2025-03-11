/* eslint-disable max-len */

const ReasonForAppealing = require('steps/reasons-for-appealing/reason-for-appealing/ReasonForAppealing');
const { expect } = require('test/util/chai');
const paths = require('paths');
const content = require('steps/reasons-for-appealing/reason-for-appealing/content.en');
const benefitTypes = require('steps/start/benefit-type/types');
const contentBenefitType = require('steps/start/benefit-type/content.en');
const config = require('config');

describe('ReasonForAppealing.js', () => {
  let reasonForAppealing = null;

  beforeEach(() => {
    reasonForAppealing = new ReasonForAppealing({
      journey: {
        steps: {
          OtherReasonForAppealing:
            paths.reasonsForAppealing.otherReasonForAppealing
        }
      }
    });

    reasonForAppealing.fields = {
      items: {}
    };
  });

  describe('get path()', () => {
    it('returns path /reason-for-appealing', () => {
      expect(ReasonForAppealing.path).to.equal(
        paths.reasonsForAppealing.reasonForAppealing
      );
    });
  });

  describe('isBenefitEnabled()', () => {
    it('returns if benefit is enabled', () => {
      expect(reasonForAppealing.isBenefitEnabled('allowUC')).to.equal(
        config.get('features.allowUC.enabled') === 'true'
      );
    });
  });

  describe('get benefitType()', () => {
    const req = {
      session: {
        BenefitType: { benefitType: benefitTypes.personalIndependencePayment }
      }
    };
    it('returns benefitType', () => {
      reasonForAppealing.req = req;
      expect(reasonForAppealing.benefitType).to.equal(
        contentBenefitType.benefitTypes.pip
      );
    });

    it('returns benefitCode', () => {
      reasonForAppealing.req = req;
      expect(reasonForAppealing.benefitCode).to.equal('PIP');
    });
  });

  describe('get addAnotherLinkContent()', () => {
    it('returns false when items is undefined', () => {
      reasonForAppealing.fields.items = undefined;
      expect(reasonForAppealing.addAnotherLinkContent).to.be.false;
    });

    it('returns add link when there are no items in the list', () => {
      reasonForAppealing.fields.items.value = [];
      expect(reasonForAppealing.addAnotherLinkContent).to.equal(
        content.links.add
      );
    });

    it('returns addAnother link when there are items in the list', () => {
      reasonForAppealing.fields.items.value = [
        {
          whatYouDisagreeWith: 'disagree',
          reasonForAppealing: 'because I do'
        }
      ];
      expect(reasonForAppealing.addAnotherLinkContent).to.equal(
        content.links.addAnother
      );
    });
  });

  describe('get field()', () => {
    let fields = null;
    let field = null;

    beforeEach(() => {
      fields = reasonForAppealing.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('items');
    });

    describe('items field', () => {
      beforeEach(() => {
        field = fields.items;
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
    let answers = null;

    beforeEach(() => {
      reasonForAppealing.fields = {
        items: {
          value: [
            {
              whatYouDisagreeWith: 'my first answer',
              reasonForAppealing: 'my second answer'
            }
          ]
        }
      };

      answers = reasonForAppealing.answers()[0];
    });

    it('should return expected section', () => {
      expect(answers.section).to.equal('reasons-for-appealing');
    });

    it('should return expected template', () => {
      expect(answers.template).to.equal('answer.html');
    });

    it('should contain a value object', () => {
      const values = reasonForAppealing.values();
      expect(values).to.eql({
        reasonsForAppealing: {
          reasons: reasonForAppealing.fields.items.value
        }
      });
    });
  });

  describe('next()', () => {
    it('returns the next step path /appellant-text-reminders', () => {
      expect(reasonForAppealing.next()).to.eql({
        nextStep: paths.reasonsForAppealing.otherReasonForAppealing
      });
    });
  });
});
