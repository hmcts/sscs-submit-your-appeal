const {
  expect
} = require('test/util/chai');
const paths = require('paths');
const EditAppeal = require('steps/edit-appeal/EditAppeal');
const sinon = require('sinon');

describe('EditAppeal.js', () => {
  let editAppeal = null;

  beforeEach(() => {
    editAppeal = new EditAppeal({
      journey: {
        steps: {
          BenefitType: paths.start.benefitType
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /draft-appeals', () => {
      expect(EditAppeal.path).to.equal(paths.editDraft);
    });
  });

  describe('next()', () => {
    it('should redirect to Benefit Type', () => {
      editAppeal.req = {
        session: {}
      };
      expect(editAppeal.next()).to.eql({
        nextStep: paths.start.benefitType
      });
    });
  });

  describe('When handler is called', () => {
    const saveF = sinon.spy();

    const req = {
      session: {
        isUserSessionRestored: true,
        drafts: {
          101: {
            key: 'value'
          }
        },
        save() {
          saveF();
        }
      },
      method: 'GET',
      query: {
        caseId: 101
      }
    };
    const redirect = sinon.spy();
    const res = {
      redirect,
      sendStatus: sinon.spy()
    };

    it('should call redirect to check your appeal when draft in body', () => {
      editAppeal.setMultiDraftsEnabled(true);
      editAppeal.handler(req, res);
      expect(saveF.called).to.eql(true);
      expect(redirect.calledWith(paths.checkYourAppeal)).to.eql(true);
    });

    it('should call redirect to benefit type when draft not in body', () => {
      delete req.session.drafts;
      editAppeal.setMultiDraftsEnabled(true);
      editAppeal.handler(req, res);
      expect(redirect.calledWith(paths.session.entry)).to.eql(true);
    });

    it('should call redirect to benefit type when not handlable', () => {
      req.method = 'PUT';
      editAppeal.setMultiDraftsEnabled(true);
      editAppeal.handler(req, res);
      expect(redirect.called).to.eql(true);
    });
  });
});
