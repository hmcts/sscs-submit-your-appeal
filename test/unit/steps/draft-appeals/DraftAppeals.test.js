const {
  expect
} = require('test/util/chai');
const paths = require('paths');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const benefitTypes = require('steps/start/benefit-type/types');
const assert = require('assert');

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
    beforeEach(() => {
      const draftList = {
        1: {
          BenefitType:
            {
              benefitType: benefitTypes.bereavementBenefit
            }
        },
        2: {
          BenefitType:
            {
              benefitType: benefitTypes.infectedBloodCompensation
            }
        },
        3: {
          BenefitType:
            {
              benefitType: benefitTypes.attendanceAllowance
            }
        }
      };
      draftAppeals.req = {
        session: {
          drafts: draftList
        }
      };
    });
    it('should return non IBA drafts', () => {
      const expectedDraftList = {
        1: {
          BenefitType:
            {
              benefitType: benefitTypes.bereavementBenefit
            }
        },
        3: {
          BenefitType:
            {
              benefitType: benefitTypes.attendanceAllowance
            }
        }
      };
      assert.deepEqual(draftAppeals.drafts, expectedDraftList);
    });

    it('should return IBA drafts for IBA', () => {
      draftAppeals.req.hostname = 'some-iba-hostname';
      const expectedDraftList = {
        2: {
          BenefitType:
            {
              benefitType: benefitTypes.infectedBloodCompensation
            }
        }
      };
      assert.deepEqual(draftAppeals.drafts, expectedDraftList);
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
    const saveF = sinon.spy();
    const req = {
      session: {
        isUserSessionRestored: true,
        save() {
          saveF();
        }
      },
      method: 'GET'
    };
    it('should call `super.handler()`', () => {
      const res = {
        redirect: sinon.spy()
      };
      draftAppeals.handler(req, res);
      expect(mockHandler.calledOnce).to.eql(true);
      expect(saveF.calledOnce).to.eql(true);
    });

    it('should redirect to benefitType if not a GET', () => {
      const res = {
        redirect: sinon.spy()
      };
      req.method = 'POST';
      draftAppeals.handler(req, res);
      expect(res.redirect.calledWith(paths.start.benefitType)).to.eql(true);
    });
  });
});
