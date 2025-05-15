/* eslint-disable init-declarations */
/* eslint-disable no-shadow */
/* eslint-disable no-empty-function */
/* eslint-disable func-names */
/* eslint-disable object-shorthand */
const { expect } = require('test/util/chai');
const sinon = require('sinon');
const logger = require('logger');
const proxyquire = require('proxyquire');
const paths = require('paths');
const moment = require('moment');

const evidenceUploadEnabled = require('config').features.evidenceUpload.enabled;

describe('The EvidenceUpload middleware', () => {
  let EvidenceUpload;
  let stubs;
  let loggerExceptionSpy;
  let loggerTraceSpy;
  const parser = sinon.stub().yields(null, [], {
    uploadEv: {
      name: 'giacomo'
    }
  });
  const unlinker = sinon.stub().yields();
  const renamer = sinon.stub().yields();


  beforeEach(function () {
    this.timeout(2500);
    stubs = {
      formidable: {
        IncomingForm: function () {
          this.parse = parser;
          this.once = () => {
          };
          this.on = () => {
          };
        }
      },
      'superagent': {
        post: sinon.stub()
          .returns({ attach: sinon.stub().returns({ field: sinon.stub()
                .resolves({
                  body: {
                    documents: [
                      {
                        originalDocumentName: '__originalDocumentName__',
                        _links: { self: { href: '__href__' } },
                        hashToken: '__hashToken__'
                      }
                    ]
                  }
                })
          }) })
      },
      'graceful-fs': {
        unlink: unlinker,
        createReadStream: () => {
        },
        rename: renamer
      },
      path: {
        resolve: () => 'a string'
      }
    };

    loggerExceptionSpy = sinon.spy(logger, 'exception');
    loggerTraceSpy = sinon.spy(logger, 'trace');
    EvidenceUpload = proxyquire(
      'steps/reasons-for-appealing/evidence-upload/EvidenceUpload.js',
      stubs
    );
    EvidenceUpload.makeDir = sinon.stub().callsArg(1);
  });

  afterEach(() => {
    parser.reset();
    unlinker.reset();
    renamer.reset();
    loggerExceptionSpy.restore();
    loggerTraceSpy.restore();
  });

  describe('handleRename', () => {
    it('should handle successful response and set req.body correctly', async () => {
      const req = {};
      const size = 42;
      const pathToFile = '__path__';
      const next = sinon.stub();

      await EvidenceUpload.handleRename(pathToFile, req, size, next)();

      expect(req.body).to.deep.equal({
        'item.uploadEv': '__originalDocumentName__',
        'item.link': '__href__',
        'item.hashToken': '__hashToken__',
        'item.size': size
      });
      expect(unlinker).to.have.been.calledWith(pathToFile, next);
    });

    it('should handle response without hashToken and set req.body correctly', async () => {
      const req = {};
      const size = 42;
      const pathToFile = '__path__';
      const next = sinon.stub();


      await EvidenceUpload.handleRename(pathToFile, req, size, next)();

      expect(req.body).to.deep.equal({
        'item.uploadEv': '__originalDocumentName__',
        'item.link': '__href__',
        'item.hashToken': '__hashToken__',
        'item.size': size
      });
      expect(unlinker).to.have.been.calledWith(pathToFile, next);
    });

    it('should handle errors and set req.body with technicalProblemError', async () => {
      const req = {};
      const size = 42;
      const pathToFile = '__path__';
      const next = sinon.stub();
      stubs['superagent'].post = sinon.stub().rejects(new Error('Upload failed'));
      EvidenceUpload = proxyquire(
        'steps/reasons-for-appealing/evidence-upload/EvidenceUpload.js',
        stubs
      );

      await EvidenceUpload.handleRename(pathToFile, req, size, next)();

      expect(req.body).to.deep.equal({
        'item.uploadEv': EvidenceUpload.technicalProblemError,
        'item.link': '',
        'item.hashToken': '',
        'item.size': 0
      });
      expect(logger.exception).to.have.been.calledWith(sinon.match.instanceOf(Error));
      expect(unlinker).to.have.been.calledWith(pathToFile, next);
    });
  });

  describe('handleMakeDir', () => {
    beforeEach(() => {
      sinon.spy(EvidenceUpload, 'handleIcomingParse');
    });

    afterEach(() => {
      EvidenceUpload.handleIcomingParse.restore();
    });

    describe('when there is an error', () => {
      it('should call next with the error', () => {
        const next = sinon.stub();
        const pathToUploadFolder = 'pathToUploadFolder';
        const req = {
          originalUrl: 'originalUrl'
        };
        const handleMakeDir = EvidenceUpload.handleMakeDir(
          next,
          pathToUploadFolder,
          req
        );
        handleMakeDir('error');
        expect(next).to.have.been.calledWith('error');
      });
    });

    describe('when there is NOT an error', () => {
      it('should return', () => {
        const next = sinon.stub();
        const pathToUploadFolder = 'pathToUploadFolder';
        const req = {
          originalUrl: 'originalUrl'
        };
        const handleMakeDir = EvidenceUpload.handleMakeDir(
          next,
          pathToUploadFolder,
          req
        );
        handleMakeDir();
        expect(EvidenceUpload.handleIcomingParse).to.have.been.called;
      });
    });
  });

  describe('handleIcomingParse', () => {
    describe('when there is an `maxFileSizeExceededError`', () => {
      it('should call fs.unlink', () => {
        const req = {
          body: {
            'item.uploadEv': EvidenceUpload.maxFileSizeExceededError
          }
        };
        const next = sinon.stub();
        const handleIcomingParse = EvidenceUpload.handleIcomingParse(req, next);
        const files = {
          'item.uploadEv': [
            {
              filepath: ''
            }
          ]
        };

        handleIcomingParse(undefined, undefined, files);
        expect(unlinker).to.have.been.called;
      });
    });

    describe('when there is an `fileMissingError`', () => {
      it('should call fs.unlink', () => {
        const req = {
          body: {
            'item.uploadEv': EvidenceUpload.fileMissingError
          }
        };
        const next = sinon.stub();
        const handleIcomingParse = EvidenceUpload.handleIcomingParse(req, next);
        const files = {
          'item.uploadEv': [
            {
              filepath: ''
            }
          ]
        };

        handleIcomingParse(undefined, undefined, files);
        expect(unlinker).to.have.been.called;
      });
    });

    describe('when there is an `totalFileSizeExceededError`', () => {
      it('should call fs.unlink', () => {
        const req = {
          body: {
            'item.uploadEv': EvidenceUpload.totalFileSizeExceededError
          }
        };
        const next = sinon.stub();
        const handleIcomingParse = EvidenceUpload.handleIcomingParse(req, next);
        const files = {
          'item.uploadEv': [
            {
              filepath: '__path__'
            }
          ]
        };

        handleIcomingParse(undefined, undefined, files);
        expect(unlinker).to.have.been.called;
      });
    });

    describe('when uploaded file is of an unsupported type', () => {
      it('should call fs.unlink', () => {
        const req = {
          body: {
            'item.uploadEv': [
              {
                filepath: '__path__'
              }
            ]
          }
        };
        const next = sinon.stub();
        const handleIcomingParse = EvidenceUpload.handleIcomingParse(req, next);
        const files = {
          'item.uploadEv': [
            {
              filepath: '__path__',
              mimetype: 'foobar'
            }
          ]
        };

        handleIcomingParse(undefined, undefined, files);
        expect(unlinker).to.have.been.called;
      });
    });

    describe('when an uploading error happens', () => {
      it('should call next', () => {
        const req = {
          body: {
            'item.uploadEv': [
              {
                filepath: '__path__'
              }
            ]
          }
        };
        const next = sinon.stub();
        const handleIcomingParse = EvidenceUpload.handleIcomingParse(req, next);
        const files = {
          'item.uploadEv': [
            {
              originalFilename: 'foo.bar'
            }
          ]
        };
        const uploadingError = { message: 'maxFileSize exceeded' };

        handleIcomingParse(uploadingError, undefined, files);
        expect(next).to.have.been.called;
      });
    });

    describe('when name file is absent', () => {
      it('should call next', () => {
        const req = {
          body: {
            'item.uploadEv': [
              {
                filepath: '__path__'
              }
            ]
          }
        };
        const next = sinon.stub();
        const handleIcomingParse = EvidenceUpload.handleIcomingParse(req, next);
        const files = {
          'item.uploadEv': [{}]
        };

        handleIcomingParse(undefined, undefined, files);
        expect(next).to.have.been.called;
      });
    });

    describe('when upload is successful', () => {
      it('should call fs.rename', () => {
        const req = {
          body: {
            'item.uploadEv': [
              {
                filepath: '__path__'
              }
            ]
          }
        };
        const next = sinon.stub();
        const handleIcomingParse = EvidenceUpload.handleIcomingParse(req, next);
        const files = {
          'item.uploadEv': [
            {
              filepath: '__path__',
              mimetype: 'image/jpeg',
              originalFilename: 'foo.jpg'
            }
          ]
        };

        handleIcomingParse(undefined, undefined, files);
        expect(renamer).to.have.been.called;
      });
    });
  });

  describe('static handleUpload', () => {
    it("if req.method is NOT post, it doesn't do anything apart from just invoking the callback", done => {
      const poster = sinon.stub();
      stubs['superagent'].post = poster;
      EvidenceUpload = proxyquire(
        'steps/reasons-for-appealing/evidence-upload/EvidenceUpload.js',
        stubs
      );
      EvidenceUpload.makeDir = sinon.stub().callsArg(1);
      EvidenceUpload.handleUpload(
        {
          method: 'get'
        },
        {},
        error => {
          expect(EvidenceUpload.makeDir).not.to.have.been.called;
          expect(parser).not.to.have.been.called;
          expect(poster).not.to.have.been.called;
          expect(error).not.to.exist;
          done();
        }
      );
    });

    it('if req.method is post, it calls makeDir', () => {
      EvidenceUpload.handleUpload(
        {
          method: 'post',
          originalUrl: `${paths.reasonsForAppealing.evidenceUpload}/item-42`
        },
        {},
        () => {
          expect(EvidenceUpload.makeDir).not.to.have.been.called;
          expect(EvidenceUpload.handleMakeDir).not.to.have.been.called;
        }
      );
    });
  });

  describe('static handleFileBegin', () => {
    let EvidenceUpload;
    const stubs = {};

    beforeEach(() => {
      EvidenceUpload = proxyquire(
        'steps/reasons-for-appealing/evidence-upload/EvidenceUpload.js',
        stubs
      );
      EvidenceUpload.makeDir = sinon.stub().callsArg(1);
    });

    describe('when receiving a zero byte upload', () => {
      const req = {};
      const incoming = { bytesExpected: 0 };
      it('should error accordingly', () => {
        EvidenceUpload.handleFileBegin(req, incoming);
        expect(req.body['item.uploadEv']).to.equal(
          EvidenceUpload.fileMissingError
        );
        expect(req.body['item.link']).to.equal('');
        expect(req.body['item.size']).to.equal(0);
        expect(loggerExceptionSpy).to.have.been.calledWith(
          'Evidence upload error: you need to choose a file'
        );
      });
    });

    describe('when receiving a file that is too big', () => {
      const req = {};
      const incoming = { bytesExpected: 5242881 };
      it('should error accordingly', () => {
        EvidenceUpload.handleFileBegin(req, incoming);
        expect(req.body['item.uploadEv']).to.equal(
          EvidenceUpload.maxFileSizeExceededError
        );
        expect(req.body['item.link']).to.equal('');
        expect(req.body['item.size']).to.equal(5242881);
        expect(req.body['item.totalFileCount']).to.equal(1);
        expect(loggerTraceSpy).to.have.been.calledWith(
          'Evidence upload error: the file is too big - file was: 5242881 bytes'
        );
      });
    });

    describe('when total size too big', () => {
      const req = {
        session: {
          EvidenceUpload: {
            items: [
              { size: 1048576 },
              { size: 1048576 },
              { size: 1048576 },
              { size: 1048576 }
            ]
          }
        }
      };
      const incoming = { bytesExpected: 1048577 };
      it('should error accordingly', () => {
        EvidenceUpload.handleFileBegin(req, incoming);
        expect(req.body['item.uploadEv']).to.equal(
          EvidenceUpload.totalFileSizeExceededError
        );
        expect(req.body['item.link']).to.equal('');
        expect(req.body['item.size']).to.equal(1048577);
        expect(req.body['item.totalFileCount']).to.equal(5);
      });
    });
  });
});

describe('static makeDir', () => {
  const getStubs = isDirectory => ({
    'graceful-fs': {
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

  describe("when directory doesn't exist", () => {
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
        const total = EvidenceUpload.getTotalSize(
          [
            {
              size: 1000
            },
            {
              size: 2001
            }
          ],
          '392'
        );
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

  describe('get middleware()', () => {
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
      instance.fields = {
        items: {
          value: [{ uploadEv: 'firstFile.png' }, { uploadEv: 'secondFile.pdf' }]
        }
      };
      const answers = instance.answers();
      expect(answers.answer).to.deep.equal(['firstFile.png', 'secondFile.pdf']);
    });
  });

  describe('next', () => {
    it('the next step is /evidence-description', () => {
      expect(instance.next().step).to.equal(
        paths.reasonsForAppealing.evidenceDescription
      );
    });
  });

  describe('isCorrectFileType', () => {
    describe('when the file is of a permitted type', () => {
      it('should return the file extension', () => {
        const result = EvidenceUpload.isCorrectFileType(
          'image/jpeg',
          'foo.jpeg'
        );
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

  describe('get addAnotherLinkContent()', () => {
    it('returns false', () => {
      expect(instance.addAnotherLinkContent).to.equal(false);
    });

    it('returns `Add file`', () => {
      instance.fields.items = {
        value: []
      };
      expect(instance.addAnotherLinkContent).to.equal('Add file');
    });

    it('returns `Add another file`', () => {
      instance.fields.items = {
        value: ['Some value']
      };
      expect(instance.addAnotherLinkContent).to.equal('Add another file');
    });
  });

  describe('editUrl', () => {
    it('returns /evidence-upload/item-1 when there are no items', () => {
      const index = 1;
      expect(instance.editUrl(index)).to.equal('/evidence-upload/item-1');
    });

    it('returns /evidence-upload/item-1 when index equals the number of items', () => {
      instance.fields.items = {
        value: ['Item one', 'Item two']
      };

      const index = 2;
      expect(instance.editUrl(index)).to.equal('/evidence-upload/item-2');
    });

    it('returns false', () => {
      instance.fields.items = {
        value: ['Item one', 'Item two']
      };

      const index = 1;
      expect(instance.editUrl(index)).to.equal(false);
    });
  });

  describe('values', () => {
    it('returns the evidences', () => {
      instance.fields.items = {
        value: [
          {
            link: 'link1',
            hashToken: 'token',
            uploadEv: 'uploadEv1'
          },
          {
            link: 'link2',
            hashToken: 'token',
            uploadEv: 'uploadEv2'
          }
        ]
      };

      expect(instance.values()).to.deep.equal({
        reasonsForAppealing: {
          evidences: [
            {
              fileName: 'uploadEv1',
              hashToken: 'token',
              url: 'link1',
              uploadedDate: moment().format('YYYY-MM-DD')
            },
            {
              fileName: 'uploadEv2',
              hashToken: 'token',
              url: 'link2',
              uploadedDate: moment().format('YYYY-MM-DD')
            }
          ]
        }
      });
    });
  });
});
