const EvidenceUpload = require('steps/reasons-for-appealing/evidence-upload/EvidenceUpload.js');
const { expect } = require('test/util/chai');
const paths = require('paths');
/* eslint-disable init-declarations */

describe('The other methods of EvidenceUpload', () => {
  let instance;

  // the feature flag would make this null
  paths.reasonsForAppealing.evidenceUpload = '/upl';

  beforeEach(() => {
    instance = new EvidenceUpload({
      journey: {
        steps: {
          EvidenceUpload: paths.reasonsForAppealing.evidenceUpload,
          TheHearing: paths.hearing.theHearing
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
      expect(instance.path).to.equal('/upl');
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

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = instance.form.fields;
    });

    it('should contain 2 field', () => {
      expect(Object.keys(fields).length).to.equal(2);
      expect(fields).to.have.all.keys(['link', 'uploadEv']);
    });

    describe('uploadEv field', () => {
      beforeEach(() => {
        field = fields.uploadEv;
      });
      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });
    });
    describe('link field', () => {
      beforeEach(() => {
        field = fields.link;
      });
      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });
    });
  });

  describe('values', () => {
    it('should have values', () => {
      expect(instance.values()).to.exist;
    });
    it('evidence should be an array', () => {
      expect(instance.values().reasonsForAppealing.evidence).to.be.an('array');
    });
  });

  describe('next', () => {
    it('the next step is /the-hearing', () => {
      expect(instance.next().step).to.equal(paths.hearing.theHearing);
    });
  });
});
/* eslint-enable init-declarations */
