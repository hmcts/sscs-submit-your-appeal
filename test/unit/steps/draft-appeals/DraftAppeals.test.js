const {
  expect
} = require('test/util/chai');
const paths = require('paths');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const mockHandler = sinon.spy();
class RestoreAllDraftsState {
  constructor(params) {
    Object.assign(this, params);
  }
  handler() {
    mockHandler();
  }
}

RestoreAllDraftsState.handler = sinon.spy();

const DraftAppeals = proxyquire('steps/draft-appeals/DraftAppeals', {
  'middleware/draftAppealStoreMiddleware': {
    RestoreAllDraftsState
  }
});

describe('DraftAppeals.js', () => {
  let draftAppeals = null;

  beforeEach(() => {
    draftAppeals = new DraftAppeals({
      journey: {
        steps: {
          BenefitType: paths.start.benefitType
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /draft-appeals', () => {
      expect(DraftAppeals.path).to.equal(paths.drafts);
    });
  });

  describe('next()', () => {
    it('should redirect to Benefit Type', () => {
      draftAppeals.req = {
        session: {}
      };
      expect(draftAppeals.next()).to.eql({
        nextStep: paths.start.benefitType
      });
    });
  });


  describe('drafts', () => {
    it('should return drafts', () => {
      const draftList = ['1', '2', '3'];

      draftAppeals.req = {
        session: {
          drafts: draftList
        }
      };
      expect(draftAppeals.drafts).to.equal(draftList);
    });
  });

  describe('appellantName()', () => {
    it('should return formatted apellant name', () => {
      const draft = {
        AppellantName: {
          firstName: 'Joe',
          lastName: 'Bloggs'
        }
      };

      expect(draftAppeals.appellantName(draft)).to.equal('Joe Bloggs');
    });

    it('should return default message when no lastName present', () => {
      const draft = {
        AppellantName: {
          firstName: 'Joe'
        }
      };
      expect(draftAppeals.appellantName(draft)).to.equal('Appellant Name Not Set');
    });

    it('should return default message when no firstName present', () => {
      const draft = {
        AppellantName: {
          lastName: 'Bloggs'
        }
      };
      expect(draftAppeals.appellantName(draft)).to.equal('Appellant Name Not Set');
    });

    it('should return default message when no AppellantName present', () => {
      const draft = {};
      expect(draftAppeals.appellantName(draft)).to.equal('Appellant Name Not Set');
    });
  });

  describe('benefit()', () => {
    it('should return formatted benefit type', () => {
      const draft = {
        BenefitType: {
          benefitType: 'PIP'
        }
      };

      expect(draftAppeals.benefit(draft)).to.equal('PIP');
    });

    it('should return default message when no benefit type present', () => {
      const draft = {
        BenefitType: {
          firstName: 'Joe'
        }
      };
      expect(draftAppeals.benefit(draft)).to.equal('Benefit Not Set');
    });
  });

  describe('mrnDate()', () => {
    it('should return formatted mrnDate', () => {
      const draft = {
        HaveAMRN: {
          haveAMRN: 'yes'
        },
        MRNDate: {
          mrnDate: {
            day: '05',
            month: '07',
            year: '2020'
          }
        }
      };

      expect(draftAppeals.mrnDate(draft)).to.equal('05 Jul 2020');
    });

    it('should return default message when does not haveAMRN is no', () => {
      const draft = {
        HaveAMRN: {
          haveAMRN: 'no'
        },
        MRNDate: {
          mrnDate: {
            day: '05',
            month: '07',
            year: '2020'
          }
        }
      };

      expect(draftAppeals.mrnDate(draft)).to.equal('No Mrn');
    });

    it('should return default message when does not haveAMRN is not present', () => {
      const draft = {
        MRNDate: {
          mrnDate: {
            day: '05',
            month: '07',
            year: '2020'
          }
        }
      };

      expect(draftAppeals.mrnDate(draft)).to.equal('No Mrn');
    });

    it('should return default message when does not mrnDate is missing', () => {
      const draft = {
        HaveAMRN: {
          haveAMRN: 'yes'
        }
      };

      expect(draftAppeals.mrnDate(draft)).to.equal('No Mrn');
    });
  });

  describe('When handler is called', () => {
    const req = { session: { isUserSessionRestored: true } };
    const redirect = sinon.spy();
    const res = {
      redirect,
      sendStatus: sinon.spy()
    };
    it('should call `super.handler()`', () => {
      draftAppeals.handler(req, res);
      expect(mockHandler.calledOnce).to.eql(true);
    });
  });
});
