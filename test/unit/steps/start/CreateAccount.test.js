const CreateAccount = require('steps/start/create-account/CreateAccount');
const { expect } = require('test/util/chai');
const userAnswer = require('utils/answer');
const paths = require('paths');

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

    it('should set createAccount to false', () => {
      createAccount.fields.createAccount.value = userAnswer.NO;
      const values = createAccount.values();
      expect(values).to.eql({ createAccount: false });
    });

    it('hould set createAccount to true', () => {
      createAccount.fields.createAccount.value = userAnswer.YES;
      const values = createAccount.values();
      expect(values).to.eql({ createAccount: true });
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
});
