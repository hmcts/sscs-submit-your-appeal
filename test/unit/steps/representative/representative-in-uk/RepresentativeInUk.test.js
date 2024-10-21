
const { expect } = require('test/util/chai');
const paths = require('paths');
const sections = require('steps/check-your-appeal/sections');
const userAnswer = require('utils/answer');
const i18next = require('i18next');
const RepresentativeInUk = require('steps/representative/representative-in-uk/RepresentativeInUk');
const sinon = require('sinon');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const benefitTypes = require('steps/start/benefit-type/types');

describe('RepresentativeInUk.js', () => {
  let representativeInUk = null;

  beforeEach(() => {
    representativeInUk = new RepresentativeInUk({
      journey: {
        steps: {
          RepresentativeDetails: paths.representative.representativeDetails,
          RepresentativeInternationalDetails: paths.representative.representativeInternationalDetails
        }
      }
    });
    representativeInUk.fields = { representativeInUk: {} };
  });

  describe('get path()', () => {
    it('returns path /representative-in-uk', () => {
      expect(RepresentativeInUk.path).to.equal(paths.representative.representativeInUk);
    });
  });
  describe('handler()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('no redirect to /does-not-exist called for iba', () => {
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
      representativeInUk.handler(req, res, next);
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
      representativeInUk.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });
  });

  describe('get form()', () => {
    let fields = null;

    beforeEach(() => {
      fields = representativeInUk.form.fields;
    });

    it('should contain 1 fields', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys(
        'inMainlandUk'
      );
    });

    it('should contain a select reference called \'inMainlandUk\'', () => {
      const selectField = fields.inMainlandUk;
      expect(selectField.constructor.name).to.eq('FieldDescriptor');
      expect(selectField.validations).to.not.be.empty;
    });
  });

  describe('answers() and values()', () => {
    const question = 'A Question';

    beforeEach(() => {
      representativeInUk.content = {
        cya: {
          inMainlandUk: {
            question,
            yes: 'Yes',
            no: 'No'
          }
        }
      };

      representativeInUk.fields = {
        inMainlandUk: {}
      };
    });

    it('should set the question and section', () => {
      const answers = representativeInUk.answers();
      expect(answers.question).to.equal(question);
      expect(answers.section).to.equal(sections.representative);
    });

    describe('English', () => {
      it('should return the correct answer \'Yes\' for CYA (English)', () => {
        representativeInUk.fields.inMainlandUk.value = userAnswer.YES;
        const answers = representativeInUk.answers();
        expect(answers.answer).to.equal('Yes');
      });

      it('should return the correct answer \'No\' for CYA (English)', () => {
        representativeInUk.fields.inMainlandUk.value = userAnswer.NO;
        const answers = representativeInUk.answers();
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
      // TODO update welsh
      it('should return the correct answer \'No\' for CYA (Welsh)', () => {
        representativeInUk.content.cya.inMainlandUk.no = 'No';
        representativeInUk.fields.inMainlandUk.value = userAnswer.NO;
        const answers = representativeInUk.answers();
        expect(answers.answer).to.equal('No');
      });
      // TODO update welsh
      it('should return the correct answer \'Yes\' for CYA (Welsh)', () => {
        representativeInUk.content.cya.inMainlandUk.yes = 'Yes';
        representativeInUk.fields.inMainlandUk.value = userAnswer.YES;
        const answers = representativeInUk.answers();
        expect(answers.answer).to.equal('Yes');
      });
    });

    describe('values', () => {
      it('should return the correct value true for Yes', () => {
        representativeInUk.fields.inMainlandUk.value = userAnswer.YES;
        const values = representativeInUk.values();
        expect(values.appellant.contactDetails.inMainlandUk).to.equal(true);
      });

      it('should return the correct value false for No', () => {
        representativeInUk.fields.inMainlandUk.value = userAnswer.NO;
        const values = representativeInUk.values();
        expect(values.appellant.contactDetails.inMainlandUk).to.equal(false);
      });
    });
  });

  describe('next()', () => {
    it('returns /representative-contact-details for Yes in UK', () => {
      representativeInUk.fields.inMainlandUk = { value: userAnswer.YES };
      expect(representativeInUk.next().step).to.eql(paths.representative.representativeDetails);
    });

    it('returns /representative-international-contact-details for No in UK', () => {
      representativeInUk.fields.inMainlandUk = { value: userAnswer.NO };
      expect(representativeInUk.next().step).to.eql(paths.representative.representativeInternationalDetails);
    });
  });
});
