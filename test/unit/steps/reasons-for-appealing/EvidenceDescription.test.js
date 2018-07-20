// eslint-disable-next-line max-len
const EvidenceDescription = require('steps/reasons-for-appealing/evidence-description/EvidenceDescription.js');
const { expect } = require('test/util/chai');
const paths = require('paths');
/* eslint-disable init-declarations */

const evidenceUploadEnabled = require('config').features.evidenceUpload.enabled;

describe('The other methods of EvidenceUpload', () => {
  let instance;
  const someEvidenceDescription = 'some evidence description';

  beforeEach(() => {
    instance = new EvidenceDescription({
      journey: {
        steps: {
          TheHearing: paths.hearing.theHearing
        }
      }
    });

    instance.fields = {
      describeTheEvidence: {
        value: someEvidenceDescription
      }
    };
  });

  describe('get path()', () => {
    it('returns the correct path', () => {
      if (evidenceUploadEnabled) {
        expect(instance.path).to.equal('/evidence-description');
      } else {
        expect(instance.path).to.be.null;
      }
    });
  });

  describe('values()', () => {
    it('values contains evidence description', () => {
      const values = instance.values();

      const expectedValue = {
        reasonsForAppealing: {
          evidenceDescription: someEvidenceDescription
        }
      };

      expect(values).to.deep.equal(expectedValue);
    });
  });

  describe('next', () => {
    it('the next step is /the-hearing', () => {
      expect(instance.next().step).to.equal(paths.hearing.theHearing);
    });
  });
});
/* eslint-enable init-declarations */
