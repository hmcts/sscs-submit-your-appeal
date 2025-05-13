const { expect } = require('test/util/chai');
const paths = require('paths');
const sections = require('steps/check-your-appeal/sections');
const userAnswer = require('utils/answer');
const i18next = require('i18next');
const RepresentativeInMainlandUk = require('steps/representative/representative-in-mainland-uk/RepresentativeInMainlandUk');
const sinon = require('sinon');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const benefitTypes = require('steps/start/benefit-type/types');
const config = require('config');

describe('RepresentativeInMainlandUk.js', () => {
  let representativeInMainlandUk = null;

  beforeEach(() => {
    representativeInMainlandUk = new RepresentativeInMainlandUk({
      journey: {
        steps: {
          RepresentativeDetails: paths.representative.representativeDetails,
          RepresentativeInternationalDetails:
            paths.representative.representativeInternationalDetails
        }
      }
    });
    representativeInMainlandUk.fields = { representativeInMainlandUk: {} };
  });

  describe('get path()', () => {
    it('returns path /representative-in-mainland-uk', () => {
      expect(RepresentativeInMainlandUk.path).to.equal(
        paths.representative.representativeInMainlandUk
      );
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
            benefitType: benefitTypes.infectedBloodCompensation
          }
        }
      };
      const res = {
        redirect: sinon.spy()
      };
      const next = sinon.spy();
      representativeInMainlandUk.handler(req, res, next);
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
      representativeInMainlandUk.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });
  });

  describe('get form()', () => {
    let fields = null;

    beforeEach(() => {
      fields = representativeInMainlandUk.form.fields;
    });

    it('should contain 1 fields', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('inMainlandUk');
    });

    it("should contain a select reference called 'inMainlandUk'", () => {
      const selectField = fields.inMainlandUk;
      expect(selectField.constructor.name).to.eq('FieldDescriptor');
      expect(selectField.validations).to.not.be.empty;
    });
  });

  describe('answers() and values()', () => {
    const question = 'A Question';
    const questionNI = 'A Question';

    beforeEach(() => {
      representativeInMainlandUk.content = {
        cya: {
          inMainlandUk: {
            question,
            questionNI,
            yes: 'Yes',
            no: 'No'
          }
        }
      };

      representativeInMainlandUk.fields = {
        inMainlandUk: {}
      };
    });

    it('should set the question and section', () => {
      const answers = representativeInMainlandUk.answers();
      expect(answers.question).to.equal(question);
      expect(answers.section).to.equal(sections.representative);
    });

    describe('English', () => {
      it("should return the correct answer 'Yes' for CYA (English)", () => {
        representativeInMainlandUk.fields.inMainlandUk.value = userAnswer.YES;
        const answers = representativeInMainlandUk.answers();
        expect(answers.answer).to.equal('Yes');
      });

      it("should return the correct answer 'No' for CYA (English)", () => {
        representativeInMainlandUk.fields.inMainlandUk.value = userAnswer.NO;
        const answers = representativeInMainlandUk.answers();
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
      it("should return the correct answer 'Nac ydw' for CYA (Welsh)", () => {
        representativeInMainlandUk.content.cya.inMainlandUk.no = 'No';
        representativeInMainlandUk.fields.inMainlandUk.value = userAnswer.NO;
        const answers = representativeInMainlandUk.answers();
        expect(answers.answer).to.equal('Nac ydw');
      });

      it("should return the correct answer 'Ydw' for CYA (Welsh)", () => {
        representativeInMainlandUk.content.cya.inMainlandUk.yes = 'Yes';
        representativeInMainlandUk.fields.inMainlandUk.value = userAnswer.YES;
        const answers = representativeInMainlandUk.answers();
        expect(answers.answer).to.equal('Ydw');
      });
    });

    describe('values', () => {
      it('should return the correct value true for Yes', () => {
        representativeInMainlandUk.fields.inMainlandUk.value = userAnswer.YES;
        const values = representativeInMainlandUk.values();
        expect(values.representative.contactDetails.inMainlandUk).to.equal(
          true
        );
      });

      it('should return the correct value false for No', () => {
        representativeInMainlandUk.fields.inMainlandUk.value = userAnswer.NO;
        const values = representativeInMainlandUk.values();
        expect(values.representative.contactDetails.inMainlandUk).to.equal(
          false
        );
      });

      it('should return the correct value false for null', () => {
        representativeInMainlandUk.fields.inMainlandUk.value = null;
        const values = representativeInMainlandUk.values();
        expect(values.representative.contactDetails.inMainlandUk).to.equal(
          null
        );
      });
    });
  });

  describe('next()', () => {
    it('returns /representative-contact-details for Yes in UK', () => {
      representativeInMainlandUk.fields.inMainlandUk = {
        value: userAnswer.YES
      };
      expect(representativeInMainlandUk.next().step).to.eql(
        paths.representative.representativeDetails
      );
    });

    it('returns /representative-international-contact-details for No in UK', () => {
      representativeInMainlandUk.fields.inMainlandUk = { value: userAnswer.NO };
      expect(representativeInMainlandUk.next().step).to.eql(
        paths.representative.representativeInternationalDetails
      );
    });
  });

  describe('allowNI flag behavior', () => {
    let configStub = null;

    beforeEach(() => {
      configStub = sinon.stub(config, 'get');
    });

    afterEach(() => {
      configStub.restore();
    });

    it('should use questionNI when allowNI is true', () => {
      // Setup the config to return true for the allowNI flag
      configStub.withArgs('features.allowNI.enabled').returns(true);

      // Create a new instance with the required journey object
      const instance = new RepresentativeInMainlandUk({
        journey: {
          steps: {
            RepresentativeDetails: paths.representative.representativeDetails,
            RepresentativeInternationalDetails:
              paths.representative.representativeInternationalDetails
          }
        }
      });

      instance.content = {
        cya: {
          inMainlandUk: {
            question: 'Regular question',
            questionNI: 'NI specific question',
            yes: 'Yes',
            no: 'No'
          }
        }
      };
      instance.fields = { inMainlandUk: { value: userAnswer.YES } };

      // Get the answers
      const answers = instance.answers();

      // Verify the correct question was used
      expect(answers.question).to.equal('NI specific question');
    });

    it('should use requiredNI error message when allowNI is true', () => {
      // Setup the config to return true for the allowNI flag
      configStub.withArgs('features.allowNI.enabled').returns(true);
      
      // Instead of mocking require, we'll use direct approach with the actual instance
      const instance = new RepresentativeInMainlandUk({
        journey: {
          steps: {
            RepresentativeDetails: paths.representative.representativeDetails,
            RepresentativeInternationalDetails:
              paths.representative.representativeInternationalDetails
          }
        }
      });
      
      // Create a spy on the text.joi function that's used in the form getter
      const formsSpy = sinon.spy(require('@hmcts/one-per-page/forms').text, 'joi');
      
      // Set up the content with our test messages
      instance.content = {
        fields: {
          inMainlandUk: {
            errors: {
              required: 'Standard error message',
              requiredNI: 'NI specific error message'
            }
          }
        }
      };
      
      // Access the form property which will use our spy
      try {
        instance.form;
      } catch (e) {
        // Ignore errors that might occur due to our stub
      }
      
      // Restore the spy
      formsSpy.restore();
      
      // Verify that our spy was called with the NI specific message
      expect(formsSpy.calledWith('NI specific error message')).to.equal(true);
    });
  });
});
