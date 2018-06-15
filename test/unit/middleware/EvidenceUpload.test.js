const { expect } = require('test/util/chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

/* eslint-disable init-declarations */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable no-empty-function */
/* eslint-disable func-names */
/* eslint-disable object-shorthand */
describe('The EvidenceUpload middleware', () => {
  const stubs = {
    fs: {
      stat: sinon.stub().yields(null, {
        isDirectory: () => true
      }),
      mkdir: sinon.stub().callsArg(1)
    }
  };
  const EvidenceUpload = proxyquire('steps/reasons-for-appealing/evidence-upload/EvidenceUpload.js', stubs);

  describe('static makedir', () => {
    beforeEach(() => {
      stubs.fs.mkdir.reset();
    });

    it('doesn\'t create the folder uploads if there is one', () => {
      stubs.fs.stat = sinon.stub().yields(null, {
        isDirectory: () => true
      });
      return EvidenceUpload.makeDir('/uploads', () => {
        return expect(stubs.fs.mkdir).to.not.have.been.called;
      });
    });
    it('does create the folder uploads if needed', () => {
      stubs.fs.stat = sinon.stub().yields(null, {
        isDirectory: () => false
      });
      return EvidenceUpload.makeDir('/uploads', () => {
        return expect(stubs.fs.mkdir).to.have.been.called;
      });
    });
  });

  describe('static handleUpload', () => {
    let EvidenceUpload;
    let stubs;
    let parser = sinon.stub().yields(null, [], {
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
    it('creates a directory, forwards the file to the api then deletes it', done => {
      EvidenceUpload.handleUpload({
        method: 'post'
      }, {}, error => {
        expect(EvidenceUpload.makeDir).to.have.been.called;
        expect(parser).to.have.been.called;
        expect(poster).to.have.been.called;
        expect(unlinker).to.have.been.called;
        expect(error).not.to.exist;
        done();
      });
    });
    it('if create directory fails, it invokes the callback with the error', done => {
      EvidenceUpload.makeDir = sinon.stub().yields(new Error('Bad dir!'));
      EvidenceUpload.handleUpload({
        method: 'post'
      }, {}, error => {
        expect(EvidenceUpload.makeDir).to.have.been.called;
        expect(parser).not.to.have.been.called;
        expect(poster).not.to.have.been.called;
        expect(unlinker).not.to.have.been.called;
        expect(error).to.exist;
        done();
      });
    });
    it('if uploading fails, it invokes the callback with the error', done => {
      parser = sinon.stub().yields(new Error('argh!'), [], {
        uploadEv: {
          name: 'giacomo'
        }
      });
      EvidenceUpload.handleUpload({
        method: 'post'
      }, {}, error => {
        expect(EvidenceUpload.makeDir).to.have.been.called;
        expect(parser).to.have.been.called;
        expect(poster).not.to.have.been.called;
        expect(unlinker).not.to.have.been.called;
        expect(error).to.exist;
        done();
      });
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
});
/* eslint-enable init-declarations */
/* eslint-enable no-shadow */
/* eslint-enable max-len */
/* eslint-enable no-empty-function */
/* eslint-enable func-names */
/* eslint-enable object-shorthand */
