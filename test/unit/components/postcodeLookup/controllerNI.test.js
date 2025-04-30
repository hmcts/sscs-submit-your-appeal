const { expect } = require('test/util/chai');
const sinon = require('sinon');
const PCL = require('components/postcodeLookup/controller');
const nock = require('nock');

const enabled = true;
const url = 'http://mockapi.com/v';
const token = 'xxxx';

const i18next = require('i18next');

describe('Components/controller.js', () => {
  let page = {};
  let pcl = {};
  let req = {};
  let res = {};
  let next = {};

  beforeEach(() => {
    req = {
      body: {},
      query: { type: 'auto' },
      session: { addressSuggestions: [], postcodeLookupType: '' }
    };
    res = { redirect: sinon.spy(), render: sinon.spy() };
    next = sinon.spy();
    page = {
      name: 'unit',
      path: 'unit-url',
      template: '',
      locals: [],
      fields: {},
      parse: sinon.spy(),
      retrieve: sinon.spy(),
      store: sinon.spy(),
      validate: sinon.spy(),
      addressSuggestions: [],
      req,
      res,
      next
    };

    nock(url)
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .get(`/postcode?&key=${token}&postcode=n29ed&lr=EN`)
      .reply(200, { results: ['address:1', 'address:2'] });
  });

  afterEach(() => {
    pcl = {};
    page = {};
    req = {};
    res = {};
    next = {};
    after(() => {
      nock.restore();
      nock.cleanAll();
    });
  });

  describe('getPostcodeLookup', () => {
    it('returns the correct English error message for Infected Blood Compensation Appeals', () => {
      page.req.session.AppellantContactDetails = { postcodeLookup: '' };
      page.req.session.BenefitType = {
        benefitType: 'Infected Blood Compensation'
      };

      pcl = new PCL(enabled, token, url, page);
      const errorMessage = pcl.schemaBuilder([
        { name: 'postcodeLookup' },
        { name: 'postcodeAddress' }
      ]).fields.postcodeLookup.validations[0].message;

      expect(errorMessage).to.eql(
        'We cannot find an England, Scotland, Wales or Northern Ireland address with that postcode'
      );
    });

    it('returns the correct English error message for all other Appeals', () => {
      page.req.session.AppellantContactDetails = { postcodeLookup: '' };
      page.req.session.BenefitType = { benefitType: '' };

      pcl = new PCL(enabled, token, url, page);
      const errorMessage = pcl.schemaBuilder([
        { name: 'postcodeLookup' },
        { name: 'postcodeAddress' }
      ]).fields.postcodeLookup.validations[0].message;

      expect(errorMessage).to.eql(
        'We cannot find an address with that postcode'
      );
    });

    it('returns the correct Welsh error message for Infected Blood Compensation Appeals', () => {
      sinon.stub(i18next, 'language').value('cy');
      page.req.session.AppellantContactDetails = { postcodeLookup: '' };
      page.req.session.BenefitType = {
        benefitType: 'Infected Blood Compensation'
      };

      pcl = new PCL(enabled, token, url, page);
      const errorMessage = pcl.schemaBuilder([
        { name: 'postcodeLookup' },
        { name: 'postcodeAddress' }
      ]).fields.postcodeLookup.validations[0].message;

      expect(errorMessage).to.eql(
        "Ni allem ddod o hyd i gyfeiriad yng Nghymru, Lloegr, yr Alban na Ogledd Iwerddon gyda'r cod post hwnnw"
      );
    });

    it('returns the correct Welsh error message for all other Appeals', () => {
      sinon.stub(i18next, 'language').value('cy');
      page.req.session.AppellantContactDetails = { postcodeLookup: '' };
      page.req.session.BenefitType = {
        benefitType: 'Infected Blood Compensation'
      };

      pcl = new PCL(enabled, token, url, page);
      const errorMessage = pcl.schemaBuilder([
        { name: 'postcodeLookup' },
        { name: 'postcodeAddress' }
      ]).fields.postcodeLookup.validations[0].message;

      expect(errorMessage).to.eql(
        "Ni allem ddod o hyd i gyfeiriad yng Nghymru, Lloegr, yr Alban na Ogledd Iwerddon gyda'r cod post hwnnw"
      );
    });
  });
});
