const { expect } = require('test/util/chai');
const sinon = require('sinon');
const PCL = require('components/postcodeLookup/controller');
const nock = require('nock');
const proxyquire = require('proxyquire');
const Joi = require('joi');

const enabled = true;
const url = 'http://mockapi.com/v';
const token = 'xxxx';

describe('Components/controller.js', () => {
  let page = {};
  let pcl = {};
  let req = {};
  let res = {};
  let next = {};

  let superCallback = {};

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
    superCallback = sinon.spy();

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
    superCallback = {};
    after(() => {
      nock.restore();
      nock.cleanAll();
    });
  });

  describe('helpers', () => {
    it('fieldmap context', () => {
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.fieldMap).to.eql({
        postcodeLookup: 'postcodeLookup',
        postcodeAddress: 'postcodeAddress',
        line1: 'addressLine1',
        line2: 'addressLine2',
        town: 'townCity',
        county: 'county',
        postCode: 'postCode'
      });
    });

    it('schemaBuilder', () => {
      page.req.session[`${page.name}`] = { type: 'manual' };
      pcl = new PCL(enabled, token, url, page);
      const manualFieldsSpy = sinon.spy(pcl, 'manualFields');
      pcl.schemaBuilder([]);
      expect(manualFieldsSpy).to.have.been.calledOnce;
      pcl.manualFields.restore();
    });

    it('postcodeLookupFields disabled field count', () => {
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.postcodeLookupFields().length).to.eql(6);
    });

    it('postcodeAddressFields disabled field count', () => {
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.postcodeAddressFields().length).to.eql(5);
    });

    it('manualFields disabled field count', () => {
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.manualFields().length).to.eql(2);
    });

    it('alldFields disabled field count', () => {
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.alldFields().length).to.eql(0);
    });

    it('resetSuggestions()', () => {
      page.addressSuggestions.push('1st address');
      page.fields.postcodeAddress = { value: 'sample address' };
      pcl = new PCL(enabled, token, url, page);
      pcl.resetSuggestions();
      expect(page.addressSuggestions).to.eql([]);
      expect(page.fields.postcodeAddress.value).to.eql('');
    });

    it('isManualPost()', () => {
      page.req.method = 'POST';
      page.req.body = { postcodeLookup: 'n20ed' };
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.isManualPost()).to.eql(false);
    });

    it('isManualPost()', () => {
      page.req.method = 'POST';
      page.req.body = {};
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.isManualPost()).to.eql(true);
    });

    it('isManualSession() true', () => {
      page.req.query = {};
      page.req.session[`${page.name}.pcl`] = { type: 'manual' };
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.isManualSession()).to.eql(true);
    });

    it('isManualSession() false', () => {
      page.req.query = {};
      page.req.session[`${page.name}.pcl`] = { type: 'auto' };
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.isManualSession()).to.eql(false);
    });

    it('isManualSession() backend', () => {
      page.req.query = {};
      page.req.session[`${page.name}`] = { type: 'manual' };
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.isManualSession()).to.eql(true);
    });

    it('isManualSession() backend', () => {
      page.req.query = {};
      page.req.session[`${page.name}`] = { type: 'auto' };
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.isManualSession()).to.eql(undefined);
    });

    it('setMode() auto', () => {
      pcl = new PCL(enabled, token, url, page);
      const result = pcl.setMode('auto');
      expect(page.req.session[`${page.name}.pcl`].type).to.eql('auto');
      expect(page.postcodeLookupType).to.eql('auto');
      expect(result).to.eql('auto');
    });

    it('handleGetValidate() manual', () => {
      page.postcodeLookupType = 'manual';
      page.addressSuggestions = [];
      pcl = new PCL(enabled, token, url, page);
      pcl.handleGetValidate();
      expect(page.validate).to.have.been.calledOnce;
    });

    it('handleGetValidate() auto', () => {
      page.postcodeLookupType = 'auto';
      page.addressSuggestions = ['address 1'];
      pcl = new PCL(enabled, token, url, page);
      pcl.handleGetValidate();
      expect(page.validate.callCount).to.eql(0);
    });
  });

  describe('getFormType()', () => {
    it('getFormType() manual', () => {
      page.req.query.type = 'manual';
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.getFormType()).to.eql('manual');
    });

    it('getFormType() manual Post', () => {
      page.req.method = 'POST';
      page.req.body = {};
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.getFormType()).to.eql('manual');
    });

    it('getFormType() auto Post', () => {
      page.req.method = 'POST';
      page.req.body = { postcodeLookup: 'n20ed' };
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.getFormType()).to.eql('auto');
    });

    it('getFormType() auto', () => {
      page.req.query.type = 'auto';
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.getFormType()).to.eql('auto');
    });

    it('getFormType() enabled', () => {
      page.req.query = {};
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.getFormType()).to.eql('auto');
    });

    it('getFormType() disabled', () => {
      pcl = new PCL(false, token, url, page);
      expect(pcl.getFormType()).to.eql('manual');
    });

    it('getFormType() manual from pcl session', () => {
      page.req.query = {};
      page.req.session[`${page.name}.pcl`] = { type: 'manual' };
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.getFormType()).to.eql('manual');
    });

    it('getFormType() auto from pcl session', () => {
      page.req.query = {};
      page.req.session[`${page.name}.pcl`] = { type: 'auto' };
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.getFormType()).to.eql('auto');
    });

    it('getFormType() manual from page session', () => {
      page.req.query = {};
      page.req.session[`${page.name}`] = { type: 'manual' };
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.getFormType()).to.eql('manual');
    });

    it('getFormType() auto from page session', () => {
      page.req.query = {};
      page.req.session[`${page.name}`] = { type: 'auto' };
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.getFormType()).to.eql('auto');
    });
  });

  describe('restoreValues()', () => {
    it('restoreValues() Get', () => {
      page.req.session = {};
      page.req.method = 'POST';
      page.req.query = {};
      pcl = new PCL(enabled, token, url, page);
      pcl.restoreValues();
      expect(page.parse).to.have.been.calledOnce;
    });

    it('restoreValues() Post', () => {
      page.req.session = {};
      page.req.method = 'GET';
      page.req.query = {};
      pcl = new PCL(enabled, token, url, page);
      pcl.restoreValues();
      expect(page.retrieve).to.have.been.calledOnce;
    });
  });

  describe('setPageState()', () => {
    it('setPageState restore suggestions', () => {
      page.fields = {
        postcodeLookup: { value: 'n29ed', validate: () => true }
      };
      pcl = new PCL(enabled, token, url, page);
      const handlePostCodeLookupSpy = sinon.spy(pcl, 'handlePostCodeLookup');
      pcl.setPageState();
      expect(handlePostCodeLookupSpy).to.have.been.calledOnce;
      pcl.handlePostCodeLookup.restore();
    });

    it('setPageState not restore suggestions', async() => {
      page.fields = { postcodeLookup: { value: '', validate: () => false } };
      pcl = new PCL(enabled, token, url, page);
      const handlePostCodeLookupSpy = sinon.spy(pcl, 'handlePostCodeLookup');
      await pcl.setPageState();
      expect(handlePostCodeLookupSpy).to.have.not.been.calledOnce;
      pcl.handlePostCodeLookup.restore();
    });

    it('setPageState auto all fields', async() => {
      page.fields = {
        postcodeLookup: { value: 'n29ed', validate: () => true },
        postcodeAddress: { value: '2000', validate: () => true }
      };
      page.addressSuggestions.push('address 1', 'address2');
      pcl = new PCL(enabled, token, url, page);
      const alldFieldsSpy = sinon.spy(pcl, 'alldFields');
      await pcl.setPageState();
      expect(alldFieldsSpy).to.have.been.calledOnce;
      pcl.alldFields.restore();
    });

    it('setPageState auto postcodeAddressFields', async() => {
      page.fields = {
        postcodeLookup: { value: 'n29ed', validate: () => true }
      };
      page.addressSuggestions.push('address 1', 'address2');
      pcl = new PCL(enabled, token, url, page);
      const postcodeAddressFieldsSpy = sinon.spy(pcl, 'postcodeAddressFields');
      await pcl.setPageState();
      expect(postcodeAddressFieldsSpy).to.have.been.calledOnce;
      pcl.postcodeAddressFields.restore();
    });

    it('setPageState auto postcodeLookupFields', async() => {
      page.fields = { postcodeLookup: { value: '', validate: () => false } };
      pcl = new PCL(enabled, token, url, page);
      const postcodeLookupFieldsSpy = sinon.spy(pcl, 'postcodeLookupFields');
      await pcl.setPageState();
      expect(postcodeLookupFieldsSpy).to.have.been.calledOnce;
      pcl.postcodeLookupFields.restore();
    });

    it('setPageState manual', async() => {
      pcl = new PCL(false, token, url, page);
      const manualFieldsSpy = sinon.spy(pcl, 'manualFields');
      const restoreValuesSpy = sinon.spy(pcl, 'restoreValues');
      await pcl.setPageState();
      expect(manualFieldsSpy).to.have.been.calledOnce;
      expect(restoreValuesSpy).to.have.been.calledTwice;
      pcl.manualFields.restore();
      pcl.restoreValues.restore();
    });
  });

  describe('handlePostCodeLookup()', () => {
    it('handlePostCodeLookup adress options found', async() => {
      page.fields = {
        postcodeLookup: { value: 'n29ed', validate: () => true }
      };
      pcl = new PCL(enabled, token, url, page);
      await pcl.handlePostCodeLookup();
      expect(page.addressSuggestions.length).to.eql(2);
    });

    it('handlePostCodeLookup adress options found', async() => {
      page.fields = {
        postcodeLookup: { value: 'non valid', validate: () => true }
      };
      pcl = new PCL(enabled, token, url, page);
      await pcl.handlePostCodeLookup();
      expect(page.fields.postcodeLookup.value).to.eql('');
    });

    it('handlePostCodeLookup server not available', async() => {
      page.fields = {
        postcodeLookup: { value: 'n29ed', validate: () => true }
      };
      pcl = new PCL(enabled, token, 'non-valid-server', page);
      await pcl.handlePostCodeLookup();
      expect(page.fields.postcodeLookup.value).to.eql('');
    });

    it('handlePostCodeLookup server not valid token', async() => {
      page.fields = {
        postcodeLookup: { value: 'n29ed', validate: () => true }
      };
      pcl = new PCL(enabled, 'non-valid-token', url, page);
      await pcl.handlePostCodeLookup();
      expect(page.fields.postcodeLookup.value).to.eql('');
    });
  });

  describe('handleAddressSelection()', () => {
    beforeEach(() => {
      page.addressSuggestions = [
        {
          DPA: {
            UPRN: '200206013',
            UDPRN: '15487017',
            ADDRESS: 'ROYALTY LOUNGE, 118, HIGH ROAD, LONDON, N2 9ED',
            ORGANISATION_NAME: 'ROYALTY LOUNGE',
            BUILDING_NUMBER: '118',
            THOROUGHFARE_NAME: 'HIGH ROAD',
            POST_TOWN: 'LONDON',
            POSTCODE: 'N2 9ED'
          }
        }
      ];

      page.fields = {
        postcodeLookup: { value: 'n29ed', validate: () => true },
        postcodeAddress: { value: '200206013', validate: () => true },
        addressLine1: { value: '' },
        addressLine2: { value: '' },
        townCity: { value: '' },
        county: { value: '' },
        postCode: { value: '' }
      };
    });

    afterEach(() => {
      page.fields = {};
      page.addressSuggestions = [];
    });

    it('handleAddressSelection adress selected', () => {
      pcl = new PCL(enabled, token, url, page);
      pcl.handleAddressSelection();
      expect(page.fields.addressLine1.value).to.eql('ROYALTY LOUNGE');
      expect(page.fields.addressLine2.value).to.eql('118 , HIGH ROAD');
      expect(page.fields.townCity.value).to.eql('LONDON');
      expect(page.fields.county.value).to.eql('LONDON');
      expect(page.fields.postCode.value).to.eql('N2 9ED');
      expect(page.store).to.have.been.calledOnce;
    });

    it('handleAddressSelection adress not selected', () => {
      pcl = new PCL(enabled, token, url, page);
      page.fields.postcodeAddress.value = '';
      page.fields.postcodeAddress.validate = () => false;
      pcl.handleAddressSelection();
      expect(page.fields.addressLine1.value).to.eql('');
      expect(page.fields.addressLine2.value).to.eql('');
      expect(page.fields.townCity.value).to.eql('');
      expect(page.fields.county.value).to.eql('');
      expect(page.fields.postCode.value).to.eql('');
      expect(page.store).to.have.been.calledOnce;
    });
  });

  describe('init()', () => {
    beforeEach(() => {
      page.fields = {
        postcodeLookup: { value: 'n29ed', validate: () => true },
        postcodeAddress: { value: '200206013', validate: () => false },
        addressLine1: { value: '' },
        addressLine2: { value: '' },
        townCity: { value: '' },
        county: { value: '' },
        postCode: { value: '' }
      };
    });

    afterEach(() => {
      page.fields = {};
    });

    it('init lookup post ', async() => {
      page.req.body = { submitType: 'lookup' };
      pcl = new PCL(enabled, token, url, page);
      const resetSuggestionsSpy = sinon.spy(pcl, 'resetSuggestions');
      const setPageStateSpy = sinon.spy(pcl, 'setPageState');
      await pcl.init(superCallback);
      expect(resetSuggestionsSpy).to.have.been.calledOnce;
      expect(setPageStateSpy).to.have.been.calledOnce;
      expect(page.res.redirect).to.have.been.calledWith(
        `${page.path}?validate=1`
      );
      pcl.resetSuggestions.restore();
      pcl.setPageState.restore();
    });

    it('controller addressSelection', async() => {
      page.req.body = { submitType: 'addressSelection' };
      pcl = new PCL(enabled, token, url, page);
      const handleAddressSelectionSpy = sinon.spy(
        pcl,
        'handleAddressSelection'
      );
      const setPageStateSpy = sinon.spy(pcl, 'setPageState');
      await pcl.init(superCallback);
      expect(handleAddressSelectionSpy).to.have.been.calledOnce;
      expect(setPageStateSpy).to.have.been.calledOnce;
      expect(page.res.redirect).to.have.been.calledWith(
        `${page.path}?validate=1`
      );
      pcl.handleAddressSelection.restore();
      pcl.setPageState.restore();
    });

    it('controller manual', async() => {
      page.req.body = { submitType: 'manual' };
      pcl = new PCL(enabled, token, url, page);
      const manualFieldsSpy = sinon.spy(pcl, 'manualFields');
      const setPageStateSpy = sinon.spy(pcl, 'setPageState');
      await pcl.init(superCallback);
      expect(manualFieldsSpy).to.have.been.calledOnce;
      expect(setPageStateSpy).to.have.been.calledOnce;
      expect(page.res.redirect).to.have.been.calledWith(
        `${page.path}?type=manual`
      );
      pcl.manualFields.restore();
      pcl.setPageState.restore();
    });

    it('controller GET and Validate', async() => {
      page.req.method = 'GET';
      page.req.query = { validate: true };
      pcl = new PCL(enabled, token, url, page);
      const handleGetValidateSpy = sinon.spy(pcl, 'handleGetValidate');
      const setPageStateSpy = sinon.spy(pcl, 'setPageState');
      await pcl.init(superCallback);
      expect(handleGetValidateSpy).to.have.been.calledOnce;
      expect(setPageStateSpy).to.have.been.calledOnce;
      expect(page.res.render).to.have.been.calledWith(
        page.template,
        page.locals
      );
      pcl.handleGetValidate.restore();
      pcl.setPageState.restore();
    });

    it('controller GET and any Type', async() => {
      page.req.method = 'GET';
      page.req.query = { type: true };
      pcl = new PCL(enabled, token, url, page);
      const setPageStateSpy = sinon.spy(pcl, 'setPageState');
      await pcl.init(superCallback);
      expect(setPageStateSpy).to.have.been.calledOnce;
      expect(page.res.render).to.have.been.calledWith(
        page.template,
        page.locals
      );
      pcl.setPageState.restore();
    });

    it('manual and not valid', async() => {
      page.req.method = 'POST';
      page.req.body = {};
      page.valid = false;
      page.validate = () => page;
      pcl = new PCL(enabled, token, url, page);
      const setPageStateSpy = sinon.spy(pcl, 'setPageState');
      await pcl.init(superCallback);
      expect(setPageStateSpy).to.have.been.calledOnce;
      expect(page.res.redirect).to.have.been.calledWith(
        `${page.path}?type=manual&validate=1`
      );
      pcl.setPageState.restore();
    });

    it('controller default super call', async() => {
      pcl = new PCL(enabled, token, url, page);
      const setPageStateSpy = sinon.spy(pcl, 'setPageState');
      await pcl.init(superCallback);
      expect(setPageStateSpy).to.have.been.calledOnce;
      expect(superCallback).to.have.been.calledOnce;
      pcl.setPageState.restore();
    });

    it('controller default super call error', () => {
      pcl = new PCL(enabled, token, url, page);
      const setPageStateSpy = sinon.spy(pcl, 'setPageState');
      pcl
        .init('')
        .catch(reason =>
          expect(reason.message).to.eq('Super Callback function is not defined')
        );
      expect(setPageStateSpy).to.have.been.calledOnce;
    });
  });

  describe('schemaBuilder with postcode validation', () => {
    beforeEach(() => {
      // Mock i18next to avoid dependency issues in test
      global.i18next = { language: 'en' };

      // Mock the content require
      const mockContent = {
        fields: {
          postcodeLookup: {
            error: {
              required: 'Enter a postcode',
              requiredNI: 'Enter a valid postcode'
            }
          },
          postcodeAddress: {
            error: {
              required: 'Select an address'
            }
          }
        }
      };

      // Mock require for content
      const originalRequire = require;
      global.require = function require(path) {
        if (path.includes('content.en') || path.includes('contentIba.en')) {
          return mockContent;
        }
        return originalRequire(path);
      };
    });

    afterEach(() => {
      global.i18next = undefined;
      global.require = require;
    });

    it('should use the correct validation when allowNI is true', () => {
      const regexSpy = sinon.spy();
      const stringPrototype = Object.getPrototypeOf(Joi.string());
      const originalRegex = stringPrototype.regex;

      stringPrototype.regex = function regex(...args) {
        regexSpy(...args);
        return originalRegex.apply(this, args);
      };

      const isIbaStub = sinon.stub().returns(true);

      // Apply stubs to controller using proxyquire
      const PCLWithStubs = proxyquire('components/postcodeLookup/controller', {
        config: {
          get: function get(key) {
            if (key === 'features.allowNI.enabled') {
              return true;
            }
            return false;
          }
        },
        'utils/benefitTypeUtils': { isIba: isIbaStub }
      });

      const pclInstance = new PCLWithStubs(enabled, token, url, page);

      // Call the schemaBuilder
      const fields = [{ name: 'postcodeLookup', validator: {} }];
      pclInstance.schemaBuilder(fields);

      // If allowNI is true and isIba is true, regex should not be called with notNiPostcode
      expect(regexSpy.called).to.be.false;

      // Restore original regex method
      stringPrototype.regex = originalRegex;
    });

    it('should use regex validation when allowNI is false', () => {
      const regexSpy = sinon.spy();
      const stringPrototype = Object.getPrototypeOf(Joi.string());
      const originalRegex = stringPrototype.regex;

      stringPrototype.regex = function regex(...args) {
        regexSpy(...args);
        return originalRegex.apply(this, args);
      };

      const PCLWithStubs = proxyquire('components/postcodeLookup/controller', {
        config: {
          get: function get(key) {
            if (key === 'features.allowNI.enabled') {
              return false;
            }
            return false;
          }
        },
        'utils/benefitTypeUtils': { isIba: () => true },
        'utils/regex': { notNiPostcode: /^(?!BT)/ }
      });

      const pclInstance = new PCLWithStubs(enabled, token, url, page);

      const fields = [{ name: 'postcodeLookup', validator: {} }];
      pclInstance.schemaBuilder(fields);

      // If allowNI is false and isIba is true, regex should be called with notNiPostcode
      expect(regexSpy.called).to.be.true;

      stringPrototype.regex = originalRegex;
    });
  });
});
