const { expect, sinon } = require('test/util/chai');
const nock = require('nock');
const rewire = require('rewire');
const config = require('config');
const httpStatus = require('http-status-codes');
const benefitTypes = require('steps/start/benefit-type/types');
const paths = require('paths');

const Pcq = rewire('steps/pcq/Pcq');

describe('Pcq.js', () => {
  let req = {};
  let res = {};
  const pcqHost = config.services.pcq.url;

  const testConfig = JSON.parse(JSON.stringify(config));
  testConfig.features.pcq.enabled = 'true';

  before(() => {
    nock.cleanAll();
    if (!nock.isActive()) {
      nock.activate();
    }
  });

  beforeEach(() => {
    req = {
      session: {},
      journey: {},
      idam: { userDetails: { email: 'test+test@test.com' } },
      headers: { host: 'localhost' }
    };
    res = {
      redirect: sinon.spy()
    };
    Pcq.__set__('config', testConfig);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('redirects to PCQ with the correct parameters', done => {
    nock(pcqHost).get('/health').reply(httpStatus.OK, { status: 'UP' });

    const revert = Pcq.__set__('uuidv4', () => {
      return 'r123';
    });

    const step = new Pcq(req, res);
    step.handler(req, res);

    setTimeout(() => {
      expect(res.redirect.calledOnce).to.equal(true);
      expect(res.redirect.args[0][0]).to.satisfy(str =>
        str.startsWith(
          // eslint-disable-next-line max-len
          'http://localhost:4000/service-endpoint?serviceId=SSCS&actor=APPELLANT&pcqId=r123&partyId=test%2Btest%40test.com&returnUrl=localhost/check-your-appeal&language=en&token='
        )
      );
      revert();
      done();
    }, 100);
  });

  it('redirects to PCQ with the correct parameters with idam user', done => {
    req.idam = {
      userDetails: {
        email: 'specificuser@idam.com'
      }
    };
    nock(pcqHost).get('/health').reply(httpStatus.OK, { status: 'UP' });

    const revert = Pcq.__set__('uuidv4', () => {
      return 'r123';
    });

    const step = new Pcq(req, res);
    step.handler(req, res);

    setTimeout(() => {
      expect(res.redirect.calledOnce).to.equal(true);
      expect(res.redirect.args[0][0]).to.satisfy(str =>
        str.startsWith(
          // eslint-disable-next-line max-len
          'http://localhost:4000/service-endpoint?serviceId=SSCS&actor=APPELLANT&pcqId=r123&partyId=specificuser%40idam.com&returnUrl=localhost/check-your-appeal&language=en&token='
        )
      );
      revert();
      done();
    }, 100);
  });

  it('values() returns the correct pcqId if present', done => {
    nock(pcqHost).get('/health').reply(httpStatus.OK, { status: 'UP' });

    const revert = Pcq.__set__('uuidv4', () => {
      return 'r123';
    });

    const step = new Pcq(req, res);
    step.handler(req, res);

    setTimeout(() => {
      expect(step.values()).to.deep.equal({
        pcqId: 'r123'
      });
      revert();
      done();
    }, 100);
  });

  it('values() returns empty if pcqId not present', () => {
    const step = new Pcq(req, res);
    step.fields = {
      pcqId: {
        value: ''
      }
    };
    expect(step.values()).to.deep.equal({});
  });

  describe('skips PCQ', () => {
    it('if it is unhealthy', done => {
      nock(pcqHost).get('/health').reply(httpStatus.OK, { status: 'DOWN' });

      const step = new Pcq(req, res);
      step.handler(req, res);

      setTimeout(() => {
        expect(res.redirect.calledOnce).to.equal(true);
        expect(res.redirect.calledWith(paths.checkYourAppeal)).to.eql(true);
        done();
      }, 100);
    });

    it('if there is an error retrieving the PCQ health', done => {
      const step = new Pcq(req, res);
      step.handler(req, res);

      setTimeout(() => {
        expect(res.redirect.calledOnce).to.equal(true);
        expect(res.redirect.calledWith(paths.checkYourAppeal)).to.eql(true);
        done();
      }, 100);
    });

    it('if IBC case', () => {
      req.session = {
        BenefitType: {
          benefitType: benefitTypes.infectedBloodCompensation
        }
      };
      nock(pcqHost).get('/health').reply(httpStatus.OK, { status: 'UP' });
      const step = new Pcq(req, res);
      step.handler(req, res);

      expect(res.redirect.calledOnce).to.equal(true);
      expect(res.redirect.calledWith(paths.checkYourAppeal)).to.eql(true);
    });

    it('if PCQ not enabled', () => {
      testConfig.features.pcq.enabled = 'false';
      nock(pcqHost).get('/health').reply(httpStatus.OK, { status: 'UP' });
      const step = new Pcq(req, res);
      step.handler(req, res);

      expect(res.redirect.calledOnce).to.equal(true);
      expect(res.redirect.calledWith(paths.checkYourAppeal)).to.eql(true);
      testConfig.features.pcq.enabled = 'true';
    });

    it('if PCQ already called', done => {
      req.session.Pcq = 'some-id';
      nock(pcqHost).get('/health').reply(httpStatus.OK, { status: 'UP' });
      const step = new Pcq(req, res);
      step.handler(req, res);

      setTimeout(() => {
        expect(res.redirect.calledOnce).to.equal(true);
        expect(res.redirect.calledWith(paths.checkYourAppeal)).to.eql(true);
        done();
      }, 100);
    });
  });

  it('answers() returns an empty array', () => {
    const step = new Pcq(req, res);
    step.handler(req, res);

    expect(step.answers()).to.deep.equal([]);
  });

  describe('get path()', () => {
    it('returns path /equality-and-diversity', () => {
      expect(Pcq.path).to.equal(paths.pcq);
    });
  });

  describe('next()', () => {
    req.journey = {
      steps: {
        CheckYourAppeal: paths.checkYourAppeal
      }
    };
    const pcq = new Pcq(req, res);
    it('redirects to /check-your-appeal', () => {
      expect(pcq.next().step).to.eql(paths.checkYourAppeal);
    });
  });
});
