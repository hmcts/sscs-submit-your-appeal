const {
  expect
} = require('test/util/chai');
const paths = require('paths');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const mockHandler = sinon.spy();

class LoadJourneyAndRedirect {
  constructor(params) {
    Object.assign(this, params);
  }
  handler() {
    mockHandler();
  }
}

LoadJourneyAndRedirect.handler = sinon.spy();

const ArchiveAppeal = proxyquire('steps/archive-appeal/ArchiveAppeal', {
  'middleware/draftAppealStoreMiddleware': {
    LoadJourneyAndRedirect
  }
});

describe('ArchiveAppeal.js', () => {
  let archiveAppeal = null;

  beforeEach(() => {
    archiveAppeal = new ArchiveAppeal({
      journey: {
        steps: {
          BenefitType: paths.start.benefitType
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /archive-appeal', () => {
      expect(ArchiveAppeal.path).to.equal(paths.archiveDraft);
    });
  });

  describe('next()', () => {
    it('should redirect to Drafts', () => {
      archiveAppeal.req = {
        session: {}
      };
      expect(archiveAppeal.next()).to.eql({
        nextStep: paths.start.benefitType
      });
    });
  });

  describe('When handler is called', () => {
    const req = {
      session: {
        isUserSessionRestored: true,
        drafts: {
          1234: {
            haveAMrn: true
          }
        },
        ccdCaseId: '4567'
      },
      method: 'GET',
      query: {
        caseId: '1234'
      }
    };
    const redirect = sinon.spy();
    const res = {
      redirect,
      sendStatus: sinon.spy()
    };

    it('should load chosen draft and redirect when multidrafts enabled and not current case', () => {
      archiveAppeal.setMultiDraftsEnabled(true);
      archiveAppeal.handler(req, res);
      expect(redirect.calledWith(`${paths.archiveDraft}/?caseId=1234`)).to.eql(true);
    });
  });
});
