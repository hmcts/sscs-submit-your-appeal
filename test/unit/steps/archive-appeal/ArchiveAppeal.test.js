const { expect } = require('test/util/chai');
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

describe('DeleteAppeal.js', () => {
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
          },
          4567: {
            haveAMrn: true
          }
        },
        ccdCaseId: 4567
      },
      method: 'GET',
      query: {
        caseId: '1234'
      }
    };

    afterEach(() => {
      sinon.restore();
    });

    it('should load chosen draft and redirect when not current case', () => {
      const res = {
        redirect: sinon.spy()
      };
      archiveAppeal.handler(req, res);
      expect(
        res.redirect.calledWith(`${paths.archiveDraft}/?caseId=1234`)
      ).to.eql(true);
    });

    it('should archived draft by case id and redirect', () => {
      const res = {
        redirect: sinon.spy()
      };
      req.query.caseId = 1234;
      archiveAppeal.handler(req, res);
      expect(res.redirect.calledWith(paths.drafts)).to.eql(false);
    });

    it('should redirect to benefitType if not a GET', () => {
      const res = {
        redirect: sinon.spy()
      };
      req.method = 'POST';
      archiveAppeal.handler(req, res);
      expect(res.redirect.calledWith(paths.start.benefitType)).to.eql(true);
    });
  });
});
