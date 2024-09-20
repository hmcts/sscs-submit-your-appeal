const CreateAccount = require('steps/start/create-account/CreateAccount');
const { expect } = require('test/util/chai');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');

describe('CreateAccount.js', () => {
  let createAccount = null;

  beforeEach(() => {
    createAccount = new CreateAccount({
      journey: {
        steps: {
          IdamRedirect: paths.start.idamRedirect,
          HaveAMRN: paths.compliance.haveAMRN
        }
      }
    });

    createAccount.fields = { createAccount: {} };
  });

  describe('get path()', () => {
    it('returns path /benefit-type', () => {
      expect(CreateAccount.path).to.equal(paths.start.createAccount);
    });
  });

  describe('answers() and values()', () => {
    const question = 'A Question';

    beforeEach(() => {
      createAccount.content = {
        cya: {
          createAccount: {
            question
          }
        }
      };

      createAccount.fields = {
        createAccount: {}
      };
    });

    it('should have the answer hidden', () => {
      const answers = createAccount.answers();
      expect(answers.hide).to.equal(true);
    });

    it('should have values be empty', () => {
      expect(createAccount.values()).to.be.empty;
    });
  });

  describe('next()', () => {
    it('returns /idam-redirect when user selects yes', () => {
      createAccount.fields.createAccount.value = 'yes';
      expect(createAccount.next().step).to.eql(paths.start.idamRedirect);
    });

    it('returns /have-you-got-an-mrn when user selects no', () => {
      createAccount.fields.createAccount.value = 'no';
      expect(createAccount.next().step).to.eql(paths.compliance.haveAMRN);
    });
  });

  describe('isTypeIba()', () => {
    it('returns false when no benefit type', () => {
      expect(createAccount.isTypeIba).to.eql(false);
    });

    it('returns false when not iba benefit type', () => {
      createAccount = new CreateAccount({
        journey: {
          req: {
            session: {
              BenefitType: {
                benefitType: benefitTypes.personalIndependencePayment
              }
            }
          },
          steps: {
            IdamRedirect: paths.start.idamRedirect,
            HaveAMRN: paths.compliance.haveAMRN
          }
        }
      });
      expect(createAccount.isTypeIba).to.eql(false);
    });

    it('returns true when iba benefit type', () => {
      createAccount = new CreateAccount({
        journey: {
          req: {
            session: {
              BenefitType: {
                benefitType: benefitTypes.infectedBloodAppeal
              }
            }
          },
          steps: {
            IdamRedirect: paths.start.idamRedirect,
            HaveAMRN: paths.compliance.haveAMRN
          }
        }
      });
      expect(createAccount.isTypeIba).to.eql(true);
    });
  });
});
