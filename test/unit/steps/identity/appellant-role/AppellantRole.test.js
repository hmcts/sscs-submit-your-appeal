
const { expect } = require('test/util/chai');
const paths = require('paths');
const sections = require('steps/check-your-appeal/sections');
const i18next = require('i18next');
const AppellantRole = require('steps/identity/appellant-role/AppellantRole');
const appellantRoleContent = require('steps/identity/appellant-role/content.en.json');
const sinon = require('sinon');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const benefitTypes = require('steps/start/benefit-type/types');

describe('AppellantRole.js', () => {
  let appellantRole = null;

  beforeEach(() => {
    appellantRole = new AppellantRole({
      journey: {
        steps: {
          AppellantName: paths.identity.enterAppellantName
        }
      }
    });
    appellantRole.fields = {};
  });

  describe('get path()', () => {
    it('returns path /appellant-role', () => {
      expect(AppellantRole.path).to.equal(paths.identity.enterAppellantRole);
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
      appellantRole.handler(req, res, next);
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
      appellantRole.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });
  });

  describe('answers() and values()', () => {
    beforeEach(() => {
      appellantRole.content = appellantRoleContent;

      appellantRole.fields = {
        ibcRole: {}
      };
    });

    it('should set the question and section', () => {
      const answers = appellantRole.answers();
      expect(answers.question).to.equal(appellantRoleContent.question);
      expect(answers.section).to.equal(sections.appellantDetails);
    });

    it('should return the correct values for yes', () => {
      appellantRole.fields.ibcRole.value = 'some value';
      const values = appellantRole.values();
      expect(values.appellant.ibcRole).to.equal('some value');
    });

    describe('English', () => {
      it('should return the correct answer for \'myself\' for CYA (English)', () => {
        appellantRole.fields.ibcRole.value = 'myself';
        const answers = appellantRole.answers();
        expect(answers.answer).to.equal('I am appealing for myself');
      });

      it('should return the correct answer for \'parent\' for CYA (English)', () => {
        appellantRole.fields.ibcRole.value = 'parent';
        const answers = appellantRole.answers();
        expect(answers.answer).to.equal('I am appealing for a person under 18 for whom I have parental responsibility');
      });

      it('should return the correct answer for \'guardian\' for CYA (English)', () => {
        appellantRole.fields.ibcRole.value = 'guardian';
        const answers = appellantRole.answers();
        expect(answers.answer).to
          .equal('I am appealing on behalf of a person who lacks capacity as their guardian, deputy or controller');
      });

      it('should return the correct answer for \'powerOfAttorney\' for CYA (English)', () => {
        appellantRole.fields.ibcRole.value = 'powerOfAttorney';
        const answers = appellantRole.answers();
        expect(answers.answer).to.equal('I am appealing on behalf of a person for who I have been granted a power of attorney');
      });

      it('should return the correct answer for \'deceasedRepresentative\' for CYA (English)', () => {
        appellantRole.fields.ibcRole.value = 'deceasedRepresentative';
        const answers = appellantRole.answers();
        expect(answers.answer).to.equal('I am appealing on behalf of a deceased person as their personal representative');
      });
    });

    describe('Welsh', () => {
      beforeEach(() => {
        i18next.changeLanguage('cy');
      });

      afterEach(() => {
        i18next.changeLanguage('en');
      });
      // TODO add welsh checks
    });
  });

  describe('get form()', () => {
    let fields = null;

    beforeEach(() => {
      fields = appellantRole.form.fields;
    });

    it('should contain 1 fields', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys(
        'ibcRole'
      );
    });

    it('should contain a select reference called \'ibcRole\'', () => {
      const selectField = fields.ibcRole;
      expect(selectField.constructor.name).to.eq('FieldDescriptor');
      expect(selectField.validations).to.not.be.empty;
    });
  });

  describe('next()', () => {
    it('returns /appellant-name', () => {
      expect(appellantRole.next().step).to.eql(paths.identity.enterAppellantName);
    });
  });
});
