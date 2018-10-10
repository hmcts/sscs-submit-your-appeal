const { expect } = require('test/util/chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const paths = require('paths');

const evidenceUploadEnabled = require('config').features.evidenceUpload.enabled;

/* eslint-disable init-declarations */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable no-empty-function */
/* eslint-disable func-names */
/* eslint-disable object-shorthand */
describe('The EvidenceUpload middleware', () => {
  describe('static handleUpload', () => {
    let EvidenceUpload;
    let stubs;
    const parser = sinon.stub().yields(null, [], {
      uploadEv: {
        name: 'giacomo'
      }
    });
    const unlinker = sinon.stub().yields();
    const poster = sinon.stub().yields(null, null, `{
      "documents": [{
        "originalDocumentName": "ugo",
        "_links": {
          "self": {
            "href": "www.bigcheese.com"
          }
        }
      }]}`);

    beforeEach(function() {
      this.timeout(2500);
      stubs = {
        formidable: {
          IncomingForm: function() {
            this.parse = parser;
            this.once = () => {};
            this.on = () => {};
          }
        },
        request: {
          post: poster
        },
        fs: {
          unlink: unlinker,
          createReadStream: () => {}
        },
        path: {
          resolve: () => 'a string'
        }
      };
      EvidenceUpload = proxyquire('steps/reasons-for-appealing/evidence-upload/EvidenceUpload.js', stubs);
      EvidenceUpload.makeDir = sinon.stub().callsArg(1);
    });

    afterEach(() => {
      parser.reset();
      unlinker.reset();
      poster.reset();
    });
    it('if req.method is not post, it doesn\'t do anything apart from just invoking the callback', done => {
      EvidenceUpload.handleUpload({
        method: 'get'
      }, {}, error => {
        expect(EvidenceUpload.makeDir).not.to.have.been.called;
        expect(parser).not.to.have.been.called;
        expect(poster).not.to.have.been.called;
        expect(error).not.to.exist;
        done();
      });
    });
  });

  describe('static handleFileBegin', () => {
    let EvidenceUpload;
    const stubs = {};

    beforeEach(() => {
      EvidenceUpload = proxyquire('steps/reasons-for-appealing/evidence-upload/EvidenceUpload.js', stubs);
      EvidenceUpload.makeDir = sinon.stub().callsArg(1);
    });

    describe('when receiving a zero byte upload', () => {
      const req = {};
      const incoming = { bytesExpected: 0 };
      const logger = { error: sinon.stub() };
      it('should error accordingly', () => {
        EvidenceUpload.handleFileBegin(req, incoming, logger);
        expect(req.body['item.uploadEv']).to.equal(EvidenceUpload.fileMissingError);
        expect(req.body['item.link']).to.equal('');
        expect(req.body['item.size']).to.equal(0);
        expect(logger.error).to.have.been.calledWith('Evidence upload error: you need to choose a file');
      });
    });

    describe('when receiving a file that is too big', () => {
      const req = {};
      const incoming = { bytesExpected: 5242881 };
      const logger = { error: sinon.stub() };
      it('should error accordingly', () => {
        EvidenceUpload.handleFileBegin(req, incoming, logger);
        expect(req.body['item.uploadEv']).to.equal(EvidenceUpload.maxFileSizeExceededError);
        expect(req.body['item.link']).to.equal('');
        expect(req.body['item.size']).to.equal(0);
        expect(logger.error).to.have.been.calledWith('Evidence upload error: the file is too big');
      });
    });

    describe('when total size too big', () => {
      const req = { session: {
        EvidenceUpload: {
          items: [
            { size: 1048576 },
            { size: 1048576 },
            { size: 1048576 },
            { size: 1048576 }
          ]
        }
      } };
      const incoming = { bytesExpected: 1048577 };
      const logger = { error: sinon.stub() };
      it('should error accordingly', () => {
        EvidenceUpload.handleFileBegin(req, incoming, logger);
        expect(req.body['item.uploadEv']).to.equal(EvidenceUpload.totalFileSizeExceededError);
        expect(req.body['item.link']).to.equal('');
        expect(req.body['item.size']).to.equal(0);
      });
    });
  });

  describe('static makeDir', () => {
    const getStubs = isDirectory => ({
      fs: {
        stat: (path, cback) => {
          cback(false, {
            isDirectory
          });
        },
        mkdir: (path, cback) => {
          cback();
        }
      },
      pt: {
        join: () => ''
      }
    });

    describe('when directory already exists', () => {
      const EvidenceUpload = proxyquire(
        'steps/reasons-for-appealing/evidence-upload/EvidenceUpload.js',
        getStubs(() => {
          return true;
        })
      );
      it('should call back', () => {
        const path = 'foobar';
        const cback = sinon.stub();
        EvidenceUpload.makeDir(path, cback);
        expect(cback).to.have.been.called;
      });
    });

    describe('when directory doesn\'t exist', () => {
      const EvidenceUpload = proxyquire(
        'steps/reasons-for-appealing/evidence-upload/EvidenceUpload.js',
        getStubs(() => {
          return false;
        })
      );
      it('should call back', () => {
        const path = 'foobar';
        const cback = sinon.stub();
        EvidenceUpload.makeDir(path, cback);
        expect(cback).to.have.been.called;
      });
      it('should follow basic logic', () => {
        expect(true).to.equal(true);
      });
    });
  });
});

describe('The other methods of EvidenceUpload', () => {
  // eslint-disable-next-line
  const EvidenceUpload = require('steps/reasons-for-appealing/evidence-upload/EvidenceUpload.js');

  let instance;

  beforeEach(() => {
    instance = new EvidenceUpload({
      journey: {
        steps: {
          EvidenceUpload: paths.reasonsForAppealing.evidenceUpload,
          TheHearing: paths.hearing.theHearing,
          EvidenceDescription: paths.reasonsForAppealing.evidenceDescription
        },
        settings: {}
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

  describe('static methods', () => {
    describe('total file size', () => {
      it('returns the sum of the items plus what is being uploaded', () => {
        const total = EvidenceUpload.getTotalSize([
          {
            size: 1000
          }, {
            size: 2001
          }
        ], '392');
        expect(total).to.equal(3393);
      });
      it('returns the expected bytes if not passed items', () => {
        const total = EvidenceUpload.getTotalSize(null, '392');
        expect(total).to.equal(392);
      });
    });
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

  describe('isCorrectFileType', () => {
    describe('when the file is of a permitted type', () => {
      it('should return the file extension', () => {
        const result = EvidenceUpload.isCorrectFileType('image/jpeg', 'foo.jpeg');
        expect(result).to.equal('.jpeg');
      });
    });

    describe('when the file is NOT of a permitted type', () => {
      it('should return `false`', () => {
        const result = EvidenceUpload.isCorrectFileType('foo/bar', 'foo.bar');
        expect(result).to.equal(false);
      });
    });
  });
});

/* eslint-enable init-declarations */
/* eslint-enable no-shadow */
/* eslint-enable max-len */
/* eslint-enable no-empty-function */
/* eslint-enable func-names */
/* eslint-enable object-shorthand */
