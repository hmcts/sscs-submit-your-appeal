const BenefitType = require('steps/start/benefit-type/BenefitType');
const sections = require('steps/check-your-appeal/sections');
const { expect } = require('test/util/chai');
const benefitTypes = require('steps/start/benefit-type/types');
const config = require('config');
const paths = require('paths');
const sinon = require('sinon');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { overrideFeatFlag } = require('utils/stringUtils');

describe('BenefitType.js', () => {
  let benefitType = null;

  beforeEach(() => {
    benefitType = new BenefitType({
      journey: {
        steps: {
          AppealFormDownload: paths.appealFormDownload,
          PostcodeChecker: paths.start.postcodeCheck,
          LanguagePreference: paths.start.languagePreference,
          Independence: paths.start.independence
        }
      }
    });
    benefitType.fields = { benefitType: {} };
  });

  describe('get path()', () => {
    it('returns path /benefit-type', () => {
      expect(BenefitType.path).to.equal(paths.start.benefitType);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = benefitType.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('benefitType');
    });

    describe('benefitType filed', () => {
      beforeEach(() => {
        field = fields.benefitType;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });
    });
  });

  describe('handler()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('redirect to /does-not-exist called for iba', () => {
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
      benefitType.handler(req, res, next);
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
      benefitType.handler(req, res, next);
      expect(res.redirect.called).to.eql(false);
      sinon.assert.calledOnce(superStub);
    });
  });

  describe('answers() and values() non iba', () => {
    const question = 'A Question';
    const value = 'Personal Independence Payment (PIP)';

    beforeEach(() => {
      benefitType.req = { session: { BenefitType: { benefitType: value } } };
      benefitType.content = { cya: { benefitType: { question } } };
      benefitType.fields = { benefitType: { value } };
    });

    it('should contain a single answer', () => {
      const answers = benefitType.answers();
      expect(answers.question).to.equal(question);
      expect(answers.section).to.equal(sections.benefitType);
      expect(answers.answer).to.equal(value);
      expect(answers.hide).to.equal(false);
    });

    it('should contain a value object', () => {
      const values = benefitType.values();
      expect(values).to.deep.equal({
        benefitType: {
          code: 'PIP',
          description: 'Personal Independence Payment'
        }
      });
    });
  });

  describe('answers() and values() iba', () => {
    const question = 'A Question';
    const value = benefitTypes.infectedBloodCompensation;

    beforeEach(() => {
      benefitType.req = { session: { BenefitType: { benefitType: value } } };
      benefitType.content = { cya: { benefitType: { question } } };
      benefitType.fields = { benefitType: { value } };
    });

    it('should contain a single answer', () => {
      const answers = benefitType.answers();
      expect(answers.question).to.equal(question);
      expect(answers.section).to.equal(sections.benefitType);
      expect(answers.answer).to.equal(value);
      expect(answers.hide).to.equal(true);
    });

    it('should contain a value object', () => {
      const values = benefitType.values();
      expect(values).to.deep.equal({
        benefitType: {
          code: 'infectedBloodCompensation',
          description: benefitTypes.infectedBloodCompensation
        }
      });
    });
  });

  describe('next()', () => {
    it('returns /appeal-form-download when benefit type is not PIP', () => {
      benefitType.fields.benefitType.value = 'not PIP';
      expect(benefitType.next().step).to.eql(paths.appealFormDownload);
    });

    it('returns /postcode-check with benefit type value is PIP', () => {
      benefitType.fields.benefitType.value = 'Personal Independence Payment (PIP)';
      expect(benefitType.next().step).to.eql(paths.start.postcodeCheck);
    });

    it('pushes ESA as allowed benefitType if allowESA is enabled', () => {
      expect(
        Object.keys(benefitTypes).includes('employmentAndSupportAllowance')
      ).to.eql(config.get('features.allowESA.enabled') === 'true');
    });

    it('pushes UC as allowed benefitType if allowUC is enabled', () => {
      expect(Object.keys(benefitTypes).includes('universalCredit')).to.eql(
        config.get('features.allowUC.enabled') === 'true'
      );
    });

    it('pushes DLA as allowed benefitType if allowDLA is enabled', () => {
      expect(
        Object.keys(benefitTypes).includes('disabilityLivingAllowance')
      ).to.eql(config.get('features.allowDLA.enabled') === 'true');
    });

    it('does not push DLA as allowed benefitType when allowDLA is not enabled', () => {
      expect(
        !Object.keys(benefitTypes).includes('disabilityLivingAllowance')
      ).to.eql(config.get('features.allowDLA.enabled') === 'false');
    });

    it('pushes IIDB as allowed benefitType if allowIIDB is enabled', () => {
      expect(
        Object.keys(benefitTypes).includes('industrialInjuriesDisablement')
      ).to.eql(config.get('features.allowIIDB.enabled') === 'true');
    });

    it('does not push IIDB as allowed benefitType when allowIIDB is not enabled', () => {
      expect(
        !Object.keys(benefitTypes).includes('industrialInjuriesDisablement')
      ).to.eql(config.get('features.allowIIDB.enabled') === 'false');
    });

    it('pushes JSA as allowed benefitType if allowJSA is enabled', () => {
      expect(Object.keys(benefitTypes).includes('jobseekersAllowance')).to.eql(
        config.get('features.allowJSA.enabled') === 'true'
      );
    });

    it('does not push JSA as allowed benefitType when allowJSA is not enabled', () => {
      expect(!Object.keys(benefitTypes).includes('jobseekersAllowance')).to.eql(
        config.get('features.allowJSA.enabled') === 'false'
      );
    });

    it('pushes Maternity Allowance as allowed benefitType if allowMA is enabled', () => {
      expect(Object.keys(benefitTypes).includes('maternityAllowance')).to.eql(
        config.get('features.allowMA.enabled') === 'true'
      );
    });

    it('does not push Maternity Allowance as allowed benefitType when allowMA is not enabled', () => {
      expect(!Object.keys(benefitTypes).includes('maternityAllowance')).to.eql(
        config.get('features.allowMA.enabled') === 'false'
      );
    });

    it('pushes Social Fund as allowed benefitType if allowSF is enabled', () => {
      expect(Object.keys(benefitTypes).includes('socialFund')).to.eql(
        config.get('features.allowSF.enabled') === 'true'
      );
    });

    it('does not push Social Fund as allowed benefitType when allowSF is not enabled', () => {
      expect(!Object.keys(benefitTypes).includes('socialFund')).to.eql(
        config.get('features.allowSF.enabled') === 'false'
      );
    });

    it('pushes Income Support as allowed benefitType if allowIS is enabled', () => {
      expect(Object.keys(benefitTypes).includes('incomeSupport')).to.eql(
        config.get('features.allowIS.enabled') === 'true'
      );
    });

    it('does not push Income Support as allowed benefitType when allowIS is not enabled', () => {
      expect(!Object.keys(benefitTypes).includes('incomeSupport')).to.eql(
        config.get('features.allowIS.enabled') === 'false'
      );
    });

    it('pushes Bereavement Support Payment Scheme as allowed benefitType if allowBSPS is enabled', () => {
      expect(
        Object.keys(benefitTypes).includes('bereavementSupportPaymentScheme')
      ).to.eql(config.get('features.allowBSPS.enabled') === 'true');
    });

    it('does not push Bereavement Support Payment Scheme as allowed benefitType when allowBSPS is not enabled', () => {
      expect(
        !Object.keys(benefitTypes).includes('bereavementSupportPaymentScheme')
      ).to.eql(config.get('features.allowBSPS.enabled') === 'false');
    });

    it('pushes Industrial Death Benefit as allowed benefitType if allowIDB is enabled', () => {
      expect(
        Object.keys(benefitTypes).includes('industrialDeathBenefit')
      ).to.eql(config.get('features.allowIDB.enabled') === 'true');
    });

    it('does not push Industrial Death Benefit as allowed benefitType when allowIDB is not enabled', () => {
      expect(
        !Object.keys(benefitTypes).includes('industrialDeathBenefit')
      ).to.eql(config.get('features.allowIDB.enabled') === 'false');
    });

    it('pushes Pension Credit as allowed benefitType if allowPC is enabled', () => {
      expect(Object.keys(benefitTypes).includes('pensionCredit')).to.eql(
        config.get('features.allowPC.enabled') === 'true'
      );
    });

    it('does not push Pension Credit as allowed benefitType when allowPC is not enabled', () => {
      expect(!Object.keys(benefitTypes).includes('pensionCredit')).to.eql(
        config.get('features.allowPC.enabled') === 'false'
      );
    });

    it('pushes Retirement Pension as allowed benefitType if allowRP is enabled', () => {
      expect(Object.keys(benefitTypes).includes('retirementPension')).to.eql(
        config.get('features.allowRP.enabled') === 'true'
      );
    });

    it('does not push Retirement Pension as allowed benefitType when allowRP is not enabled', () => {
      expect(!Object.keys(benefitTypes).includes('retirementPension')).to.eql(
        config.get('features.allowRP.enabled') === 'false'
      );
    });

    it('pushes Child support as allowed benefitType', () => {
      expect(Object.keys(benefitTypes).includes('childSupport'));
    });

    it('returns /language-preference when Welsh feature toggle is on', () => {
      // eslint-disable-next-line no-process-env
      process.env.FT_WELSH = 'true';

      benefitType.fields.benefitType.value = 'Personal Independence Payment (PIP)';
      expect(benefitType.next().step).to.eql(paths.start.languagePreference);

      // eslint-disable-next-line no-process-env
      process.env.FT_WELSH = 'false';
    });

    it('returns /appeal-form-download when benefit type is not PIP when Welsh feature toggle is on', () => {
      // eslint-disable-next-line no-process-env
      process.env.FT_WELSH = 'true';

      benefitType.fields.benefitType.value = 'not PIP';
      expect(benefitType.next().step).to.eql(paths.appealFormDownload);

      // eslint-disable-next-line no-process-env
      process.env.FT_WELSH = 'false';
    });

    it('returns /independence when benefit type is IBA when Welsh feature toggle is off', () => {
      benefitType.fields.benefitType.value = benefitTypes.infectedBloodCompensation;
      const test = benefitType.next();
      expect(test.step).to.eql(paths.start.independence);
    });
  });

  describe('getAllowedTypes()', () => {
    const allowedTypes = [
      benefitTypes.personalIndependencePayment,
      benefitTypes.employmentAndSupportAllowance,
      benefitTypes.universalCredit,
      benefitTypes.infectedBloodCompensation
    ];
    before(() => {
      overrideFeatFlag({ key: 'allowDLA', value: false });
      overrideFeatFlag({ key: 'allowCA', value: false });
      overrideFeatFlag({ key: 'allowAA', value: false });
      overrideFeatFlag({ key: 'allowBB', value: false });
      overrideFeatFlag({ key: 'allowIIDB', value: false });
      overrideFeatFlag({ key: 'allowJSA', value: false });
      overrideFeatFlag({ key: 'allowSF', value: false });
      overrideFeatFlag({ key: 'allowMA', value: false });
      overrideFeatFlag({ key: 'allowIS', value: false });
      overrideFeatFlag({ key: 'allowBSPS', value: false });
      overrideFeatFlag({ key: 'allowIDB', value: false });
      overrideFeatFlag({ key: 'allowPC', value: false });
      overrideFeatFlag({ key: 'allowRP', value: false });
    });
    it('returns base list when no feature flags on', () => {
      expect(benefitType.getAllowedTypes()).to.eql(allowedTypes);
    });
    it('returns updated list when allowDLA feature flag on', () => {
      overrideFeatFlag({ key: 'allowDLA', value: true });
      allowedTypes.push(benefitTypes.disabilityLivingAllowance);
      expect(benefitType.getAllowedTypes()).to.eql(allowedTypes);
    });
    it('returns updated list when allowCA feature flag on', () => {
      overrideFeatFlag({ key: 'allowCA', value: true });
      allowedTypes.push(benefitTypes.carersAllowance);
      expect(benefitType.getAllowedTypes()).to.eql(allowedTypes);
    });
    it('returns updated list when allowAA feature flag on', () => {
      overrideFeatFlag({ key: 'allowAA', value: true });
      allowedTypes.push(benefitTypes.attendanceAllowance);
      expect(benefitType.getAllowedTypes()).to.eql(allowedTypes);
    });
    it('returns updated list when allowBB feature flag on', () => {
      overrideFeatFlag({ key: 'allowBB', value: true });
      allowedTypes.push(benefitTypes.bereavementBenefit);
      expect(benefitType.getAllowedTypes()).to.eql(allowedTypes);
    });
    it('returns updated list when allowIIDB feature flag on', () => {
      overrideFeatFlag({ key: 'allowIIDB', value: true });
      allowedTypes.push(benefitTypes.industrialInjuriesDisablement);
      expect(benefitType.getAllowedTypes()).to.eql(allowedTypes);
    });
    it('returns updated list when allowJSA feature flag on', () => {
      overrideFeatFlag({ key: 'allowJSA', value: true });
      allowedTypes.push(benefitTypes.jobseekersAllowance);
      expect(benefitType.getAllowedTypes()).to.eql(allowedTypes);
    });
    it('returns updated list when allowSF feature flag on', () => {
      overrideFeatFlag({ key: 'allowSF', value: true });
      allowedTypes.push(benefitTypes.socialFund);
      expect(benefitType.getAllowedTypes()).to.eql(allowedTypes);
    });
    it('returns updated list when allowMA feature flag on', () => {
      overrideFeatFlag({ key: 'allowMA', value: true });
      allowedTypes.push(benefitTypes.maternityAllowance);
      expect(benefitType.getAllowedTypes()).to.eql(allowedTypes);
    });
    it('returns updated list when allowIS feature flag on', () => {
      overrideFeatFlag({ key: 'allowIS', value: true });
      allowedTypes.push(benefitTypes.incomeSupport);
      expect(benefitType.getAllowedTypes()).to.eql(allowedTypes);
    });
    it('returns updated list when allowBSPS feature flag on', () => {
      overrideFeatFlag({ key: 'allowBSPS', value: true });
      allowedTypes.push(benefitTypes.bereavementSupportPaymentScheme);
      expect(benefitType.getAllowedTypes()).to.eql(allowedTypes);
    });
    it('returns updated list when allowIDB feature flag on', () => {
      overrideFeatFlag({ key: 'allowIDB', value: true });
      allowedTypes.push(benefitTypes.industrialDeathBenefit);
      expect(benefitType.getAllowedTypes()).to.eql(allowedTypes);
    });
    it('returns updated list when allowPC feature flag on', () => {
      overrideFeatFlag({ key: 'allowPC', value: true });
      allowedTypes.push(benefitTypes.pensionCredit);
      expect(benefitType.getAllowedTypes()).to.eql(allowedTypes);
    });
    it('returns updated list when allowRP feature flag on', () => {
      overrideFeatFlag({ key: 'allowRP', value: true });
      allowedTypes.push(benefitTypes.retirementPension);
      expect(benefitType.getAllowedTypes()).to.eql(allowedTypes);
    });
  });
});
