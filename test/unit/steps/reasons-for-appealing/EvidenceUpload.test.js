const EvidenceUpload = require('steps/reasons-for-appealing/evidence-upload/EvidenceUpload.js');
const { expect } = require('test/util/chai');
const paths = require('paths');
/* eslint-disable init-declarations */

const evidenceUploadEnabled = require('config').features.evidenceUpload.enabled;

describe('The other methods of EvidenceUpload', () => {
  let instance;

  beforeEach(() => {
    instance = new EvidenceUpload({
      journey: {
        steps: {
          EvidenceUpload: paths.reasonsForAppealing.evidenceUpload,
          TheHearing: paths.hearing.theHearing,
          EvidenceDescription: paths.reasonsForAppealing.evidenceDescription
        }
      }
    });
    instance.fields = {
      uploadEv: {
        value: 'ugo'
      },
      link: {
        value: 'www.example.com'
      }
    };
  });

  describe('get path()', () => {
    it('returns the correct path', () => {
      if (evidenceUploadEnabled) {
        expect(instance.path).to.equal('/evidence-upload');
      } else {
        expect(instance.path).to.be.null;
      }
    });
  });

  describe('middleware', () => {
    it('returns an array', () => {
      expect(instance.middleware).to.be.an('array');
    });
    it('prepend its upload middleware to the parent middleware', () => {
      expect(instance.middleware.length).to.be.greaterThan(1);
    });
  });

  describe('get field()', () => {
    let fields = null;

    before(() => {
      fields = instance.fields;
    });

    it('should contain 2 field', () => {
      expect(Object.keys(fields).length).to.equal(2);
      expect(fields).to.have.all.keys(['link', 'uploadEv']);
    });
  });

  describe('answer', () => {
    it('answer', () => {
      instance.fields = { items: {
        value: [{ uploadEv: 'firstFile.png' }, { uploadEv: 'secondFile.pdf' }]
      } };
      const answers = instance.answers();
      expect(answers.answer).to.deep.equal(['firstFile.png', 'secondFile.pdf']);
    });
  });

  describe('next', () => {
    it('the next step is /evidence-description', () => {
      expect(instance.next().step).to.equal(paths.reasonsForAppealing.evidenceDescription);
    });
  });
});
/* eslint-enable init-declarations */
