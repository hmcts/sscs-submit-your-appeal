const UnauthorizedError = require('steps/errors/unauthorized/UnauthorizedError');
const { expect } = require('test/util/chai');
const paths = require('paths');
const { stub } = require('sinon');
const sinon = require('sinon');

describe('UnauthorizedError.js', () => {
  let req = stub();
  let res = stub();
  let UnauthorizedErrorClass = null;

  beforeEach(() => {
    UnauthorizedErrorClass = new UnauthorizedError({
      journey: {
        steps: {
          UnauthorizedError: paths.errors.UnauthorizedErrorClass
        }
      }
    });
  });

  afterEach(() => {
    req = {};
    res = {};
  });

  describe('get path()', () => {
    it('returns path /unauthorized-case-error', () => {
      expect(UnauthorizedError.path).to.equal('/unauthorized-case-error');
    });

    describe('handler when method is GET', () => {
      req.method = 'GET';
      const unauthorizedSession = sinon.stub().returns(UnauthorizedError);
      it('calls res.send()', () => {
        UnauthorizedErrorClass.handler(req, res);
        unauthorizedSession().should.eql(UnauthorizedError);
        expect(unauthorizedSession).to.have.been.calledOnce;
      });
    });

    describe('handler when method is POST', () => {
      req.method = 'POST';
      const unauthorizedSession = sinon.stub().returns(UnauthorizedError);
      it('not calls res.send()', () => {
        UnauthorizedErrorClass.handler(req, res);
        expect(unauthorizedSession).to.have.not.been.calledOnce;
      });
    });
  });
});
