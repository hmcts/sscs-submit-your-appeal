const CreateAccount = require('steps/start/create-account/CreateAccount');
const { expect } = require('test/util/chai');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

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

  describe('get middleware()', () => {
    it('returns correct middleware array', () => {
      expect(createAccount.middleware).to.be.an('array');
      expect(createAccount.middleware).to.have.length(11);
      expect(createAccount.middleware).to.include(checkWelshToggle);
    });
  });
});
