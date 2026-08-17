const { expect } = require('test/util/chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const paths = require('paths');
const i18next = require('i18next');

describe('EvidenceUpload.js', () => {
  let EvidenceUpload = null;
  let evidenceUpload = null;
  let textStub = null;
  let objectStub = null;

  beforeEach(() => {
    const fieldMock = {
      messages: []
    };
    fieldMock.joi = msg => {
      fieldMock.messages.push(msg);
      return fieldMock;
    };
    textStub = {
      joi: fieldMock.joi
    };
    objectStub = obj => obj;

    EvidenceUpload = proxyquire('steps/reasons-for-appealing/evidence-upload/EvidenceUpload', {
      '@hmcts/one-per-page/forms': {
        text: textStub,
        object: objectStub
      }
    });

    evidenceUpload = new EvidenceUpload({
      journey: {
        steps: {
          EvidenceDescription: paths.reasonsForAppealing.evidenceDescription
        }
      }
    });

    // Reset messages after initialization if any
    fieldMock.messages = [];
    evidenceUpload.fieldMock = fieldMock;
  });

  describe('get path()', () => {
    it('returns path /evidence-upload', () => {
      expect(EvidenceUpload.path).to.equal(paths.reasonsForAppealing.evidenceUpload);
    });
  });

  describe('get field()', () => {
    it('should use English content by default', () => {
      i18next.changeLanguage('en');
      evidenceUpload.field;
      expect(evidenceUpload.fieldMock.messages).to.contain('You have not uploaded a file. Please upload your file again.');
    });

    it('should use Welsh content when language is set to cy', () => {
      i18next.changeLanguage('cy');
      evidenceUpload.field;
      expect(evidenceUpload.fieldMock.messages).to.contain('Nid ydych wedi llwytho ffeil. Rhowch gynnig arall arni.');
    });

    it('should fall back to English content when language is not supported', () => {
      i18next.changeLanguage('fr');
      evidenceUpload.field;
      expect(evidenceUpload.fieldMock.messages).to.contain('You have not uploaded a file. Please upload your file again.');
    });

    afterEach(() => {
      i18next.changeLanguage('en');
    });
  });

  describe('validateList()', () => {
    let listMock = null;

    beforeEach(() => {
      listMock = {
        check: sinon.stub().returnsArg(0)
      };
    });

    it('should use English content for noItemsError by default', () => {
      i18next.changeLanguage('en');
      const result = evidenceUpload.validateList(listMock);
      expect(result).to.equal('You have not uploaded any files. Upload at least one file before you continue. Click ‘back’ if you do not want to upload anything.');
    });

    it('should use Welsh content for noItemsError when language is set to cy', () => {
      i18next.changeLanguage('cy');
      const result = evidenceUpload.validateList(listMock);
      expect(result).to.equal('Nid ydych wedi llwytho unrhyw ffeiliau. Llwythwch o leiaf un ffeil cyn parhau. Cliciwch ‘yn ôl’ os nad ydych eisiau llwytho unrhyw beth.');
    });

    afterEach(() => {
      i18next.changeLanguage('en');
    });
  });
});
