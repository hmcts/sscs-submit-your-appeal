const { expect } = require('test/util/chai');
const Confirmation = require('steps/confirmation/Confirmation');
const paths = require('paths');
const urls = require('urls');
const preserveSession = require('middleware/preserveSession');

const session = {
  paper: {
    req: {
      sess: {
        TheHearing: {
          attendHearing: 'no'
        }
      }
    }

  },
  oral: {
    req: {
      sess: {
        TheHearing: {
          attendHearing: 'yes'
        }
      }
    }
  }
};

const setHearingType = (Step, type) => Object.assign(Step, session[type]);

describe('Confirmation.js', () => {
  let confirmationClass = null;

  beforeEach(() => {
    confirmationClass = new Confirmation({
      journey: {},
      req: {
        sess: {
          TheHearing: {
            attendHearing: null
          }
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /confirmation', () => {
      expect(Confirmation.path).to.equal(paths.confirmation);
    });
  });

  describe('suffix()', () => {
    it('should return Iba for IBA case', () => {
      confirmationClass.req.hostname = 'some-iba-hostname';
      expect(confirmationClass.suffix).to.eql('Iba');
    });

    it('should return empty for non IBA case', () => {
      confirmationClass.req.hostname = 'some-normal-hostname';
      expect(confirmationClass.suffix).to.eql('');
    });
  });

  describe('get session()', () => {
    it('returns path /confirmation', () => {
      expect(confirmationClass.session).to.equal(confirmationClass.req.sess);
    });
  });

  describe('get paperCase()', () => {
    describe('for oral cases', () => {
      it('should return false', () => {
        const OralCase = setHearingType(confirmationClass, 'oral');
        expect(OralCase.paperCase).to.equal(false);
      });
    });
    describe('for paper cases', () => {
      it('should return true', () => {
        const PaperCase = setHearingType(confirmationClass, 'paper');
        expect(PaperCase.paperCase).to.equal(true);
      });
    });
  });

  describe('get oralCase()', () => {
    describe('for oral cases', () => {
      it('should return false', () => {
        const OralCase = setHearingType(confirmationClass, 'oral');
        expect(OralCase.oralCase).to.equal(true);
      });
    });
    describe('for paper cases', () => {
      it('should return true', () => {
        const PaperCase = setHearingType(confirmationClass, 'paper');
        expect(PaperCase.oralCase).to.equal(false);
      });
    });
  });

  describe('get middleware()', () => {
    it('returns path /confirmation', () => {
      expect(confirmationClass.middleware[0]).to.equal(preserveSession);
    });
  });

  describe('get surveyLink()', () => {
    it('returns the smart survey url ', () => {
      expect(confirmationClass.surveyLink).to.equal(urls.surveyLink);
    });
  });
});
