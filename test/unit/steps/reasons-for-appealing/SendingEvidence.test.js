const { expect, sinon } = require('test/util/chai');
const proxyquire = require('proxyquire');
const paths = require('paths');

describe('SendingEvidence.js', () => {
  const retrieveValue = value => {
    return {
      retrieve: sinon.stub().returns({
        emailAddress: {
          value
        }
      })
    };
  };
  const createClassInstance = retrieve => {
    return proxyquire(
      'steps/reasons-for-appealing/sending-evidence/SendingEvidence',
      {
        'lib/vendor/one-per-page/forms': {
          form: sinon.stub().returns(retrieve)
        }
      }
    );
  };
  const instantiateClass = Class => {
    return new Class({
      journey: {
        steps: {
          TheHearing: paths.hearing.theHearing,
          AppellantContactDetails: paths.reasonsForAppealing.sendingEvidence,
          EvidenceUpload: paths.reasonsForAppealing.evidenceUpload
        }
      }
    });
  };
  let SendingEvidence = createClassInstance(
    retrieveValue('harry.potter@wizards.com')
  );
  let sendingEvidence = null;

  before(() => {
    sendingEvidence = instantiateClass(SendingEvidence);
    sendingEvidence.fields = {
      emailAddress: {}
    };
  });

  describe('get path()', () => {
    it('returns path /sending-evidence', () => {
      expect(SendingEvidence.path).to.equal(
        paths.reasonsForAppealing.sendingEvidence
      );
    });
  });

  describe('next()', () => {
    it('nextStep equals /the-hearing', () => {
      sendingEvidence = instantiateClass(SendingEvidence);
      sendingEvidence.fields = {
        emailAddress: {}
      };
      const next = sendingEvidence.next();
      const step = next.step;
      expect(step).to.eql(paths.hearing.theHearing);
    });
  });

  describe('get hasSignedUpForEmail()', () => {
    it('should be true when the email address has been defined', () => {
      sendingEvidence.fields.emailAddress.value = 'harry.potter@wizards.com';
      expect(sendingEvidence.hasSignedUpForEmail).to.be.true;
    });

    it('should be false when the email address has not been defined', () => {
      SendingEvidence = createClassInstance(retrieveValue(undefined));
      sendingEvidence = instantiateClass(SendingEvidence);
      sendingEvidence.fields = {
        emailAddress: {}
      };
      expect(sendingEvidence.hasSignedUpForEmail).to.be.false;
    });
  });
});
