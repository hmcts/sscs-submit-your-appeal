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
});
/* eslint-enable init-declarations */
/* eslint-enable no-shadow */
/* eslint-enable max-len */
/* eslint-enable no-empty-function */
/* eslint-enable func-names */
/* eslint-enable object-shorthand */
