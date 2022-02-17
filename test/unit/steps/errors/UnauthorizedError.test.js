const UnauthorizedError = require('steps/errors/unauthorized/UnauthorizedError');
const { expect } = require('test/util/chai');
const paths = require('paths');
const { stub } = require('sinon');

describe('UnauthorizedError.js', () => {
  let req = {};
  let res = {};
  let unauthorizedErrorClass = null;

  beforeEach(() => {
    req = {};
    res = {
      render: stub()
    };

    unauthorizedErrorClass = new UnauthorizedError({
      journey: {
        steps: {
          UnauthorizedError: paths.errors.UnauthorizedErrorClass
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /unauthorized-case-error', () => {
      expect(UnauthorizedError.path).to.equal('/unauthorized-case-error');
    });
  });

  describe('handler when method is GET', () => {
    it('calls res.render', () => {
      req.method = 'GET';
      unauthorizedErrorClass.handler(req, res);
      expect(res.render).to.have.been.calledOnce;
    });
  });

  describe('handler when method is POST', () => {
    it('not calls res.send()', () => {
      req.method = 'POST';
      unauthorizedErrorClass.handler(req, res);
      expect(res.render).to.have.not.been.called;
    });
  });
});