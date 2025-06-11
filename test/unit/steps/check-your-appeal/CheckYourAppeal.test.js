const { expect, sinon } = require('test/util/chai');
const sections = require('steps/check-your-appeal/sections');
const HttpStatus = require('http-status-codes');
const proxyquire = require('proxyquire');
const paths = require('paths');
const config = require('config');

const allowSaveAndReturn =
  config.get('features.allowSaveAndReturn.enabled') === 'true';

describe('CheckYourAppeal.js', () => {
  let CheckYourAppeal = null;
  let cya = null;
  let cyaWithSession = null;
  let fields = null;

  const request = {};
  const loggerStub = {};

  before(() => {
    CheckYourAppeal = proxyquire('steps/check-your-appeal/CheckYourAppeal', {
      superagent: request,
      logger: loggerStub
    });

    cya = new CheckYourAppeal({
      journey: {
        steps: {
          Confirmation: paths.confirmation,
          DuplicateError: paths.errors.duplicateCaseError,
          Error500: paths.errors.internalServerError
        },
        visitedSteps: [{ benefitType: '' }],
        answers: [],
        values: {
          hearing: {
            wantsToAttend: true
          },
          benefit: {
            type: 'PIP'
          },
          isAppointee: false,
          hasRepresentative: true
        },
        settings: {
          apiUrl: '/appeals'
        }
      }
    });

    cyaWithSession = new CheckYourAppeal({
      journey: {
        steps: {
          Confirmation: paths.confirmation,
          Error500: paths.errors.internalServerError
        },
        visitedSteps: [{ benefitType: '' }],
        answers: [],
        values: {
          appellant: {
            nino: 'AA998877A'
          },
          benefit: {
            type: 'PIP'
          },
          isAppointee: false,
          hasRepresentative: true
        },
        settings: {
          apiUrl: '/appeals'
        },
        req: {
          session: {
            id: 'someId'
          }
        }
      }
    });

    cya.fields = {
      signer: {
        value: 'Mr Tester'
      }
    };

    fields = cya.form.fields;
  });

  describe('get path()', () => {
    it('returns path /check-your-appeal', () => {
      expect(CheckYourAppeal.path).to.equal(paths.checkYourAppeal);
    });
  });

  describe('handler', () => {
    let arrayFilterSpy = '';
    let req = '';
    let res = '';
    let next = '';

    before(() => {
      arrayFilterSpy = sinon.spy(Array.prototype, 'filter');
      req = sinon.spy();
      res = sinon.spy();
      next = sinon.spy();
    });

    after(() => {
      Array.prototype.filter.restore();
    });

    it('check you appeal to call  array filter', () => {
      cya.handler(req, res, next);
      if (allowSaveAndReturn) {
        expect(arrayFilterSpy).to.be.calledOnce;
      }
    });
  });

  describe('sendToAPI()', () => {
    it('should log a message when successfully making an API call', () => {
      loggerStub.trace = sinon.stub().returns();
      loggerStub.event = sinon.stub();

      request.post = () => ({
        set: () => ({
          send: sinon.stub().resolves({ status: HttpStatus.CREATED })
        })
      });

      return cya.sendToAPI().then(() => {
        expect(loggerStub.trace).to.have.been.calledWith(
          'POST api:/appeals status:201'
        );
        expect(loggerStub.event).to.have.been.calledOnce;
      });
    });

    it('should log an event when missing data from journey values', () => {
      loggerStub.event = sinon.stub();

      request.post = () => ({
        set: () => ({
          send: sinon.stub().resolves({ status: HttpStatus.CREATED })
        })
      });

      return cyaWithSession.sendToAPI().then(() => {
        expect(loggerStub.event).to.have.been.calledTwice;
      });
    });

    it('should log error and track in app insights when unsuccessfully making an API call', () => {
      request.post = () => ({
        set: () => ({
          send: sinon.stub().rejects({ message: 'Internal server error' })
        })
      });
      loggerStub.exception = sinon.spy();
      loggerStub.event = sinon.spy();
      return cya.sendToAPI().catch(() => {
        expect(loggerStub.exception).to.have.been.calledOnce;
        expect(loggerStub.event).to.have.been.calledWith(
          'SYA-SendToApi-Failed'
        );
      });
    });

    it('should log duplicate conflict error and track in app insights when unsuccessfully making an API call', () => {
      request.post = () => ({
        set: () => ({
          send: sinon.stub().rejects({ status: HttpStatus.CONFLICT })
        })
      });
      loggerStub.exception = sinon.spy();
      loggerStub.event = sinon.spy();
      return cya.sendToAPI().catch(() => {
        expect(loggerStub.exception).to.have.been.calledOnce;
        expect(loggerStub.event).to.have.been.calledWith(
          'SYA-SendToApi-Duplicate'
        );
      });
    });
  });

  describe('get section()', () => {
    it('returns the CYA sections', () => {
      const cyaSections = cya.sections();
      Object.values(sections).map((value, index) =>
        expect(cyaSections[index].id).to.equal(value)
      );
    });
  });

  describe('get form()', () => {
    let field = null;

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('signer');
    });

    describe('signer field', () => {
      beforeEach(() => {
        field = fields.signer;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });
    });
  });

  describe('get values()', () => {
    it('contains the signAndSubmit json object field', () => {
      expect(cya.values().signAndSubmit.signer).to.equal('Mr Tester');
    });
  });

  describe('next()', () => {
    it('returns the next step path /confirmation', () => {
      const action = cya.next();
      expect(action.nextFlow.nextStep).to.eql(paths.confirmation);
    });
  });

  describe('termsAndConditionPath()', () => {
    it('should return /terms-and-conditions', () => {
      expect(cya.termsAndConditionPath).to.equal(
        paths.policy.termsAndConditions
      );
    });
  });

  describe('tokenHeader()', () => {
    it('should return valid user token', () => {
      const req = { cookies: { '__auth-token': 'xxx' } };
      expect(cya.tokenHeader(req).Authorization).to.equal('Bearer xxx');
    });

    it('should not return token', () => {
      const req = { cookies: {} };
      expect(cya.tokenHeader(req)).to.be.empty;
    });
  });
});
