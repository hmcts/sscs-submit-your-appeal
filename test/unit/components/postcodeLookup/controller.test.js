const { expect } = require('test/util/chai');
const sinon = require('sinon');
const PCL = require('components/postcodeLookup/controller');
const config = require('config');
const nock = require('nock');

const enabled = config.postcodeLookup.enabled === 'true';
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
    req = { body: {},
      query: { type: 'auto' },
      session: { addressSuggestions: [], postcodeLookupType: '' } };
    res = {};
    next = sinon.spy();
    page = { name: 'unit',
      fields: {},
      parse: sinon.spy(),
      retrieve: sinon.spy(),
      store: sinon.spy(),
      validate: sinon.spy(),
      addressSuggestions: [], req, res, next };
    superCallback = sinon.spy();

    nock(url)
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .get(`/addresses/postcode?postcode=n29ed&key=${token}`)
      .reply(200, { results: [ 'address:1', 'address:2'] });
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

    it('postcodeLookupFields disabled field count', () => {
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.postcodeLookupFields().length).to.eql(6);
    });

    it('postcodeAddressFields disabled field count', () => {
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.postcodeAddressFields().length).to.eql(5);
    });

    it('manualFileds disabled field count', () => {
      pcl = new PCL(enabled, token, url, page);
      expect(pcl.manualFileds().length).to.eql(2);
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
      page.req.body = { };
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
      page.fields = { postcodeLookup: { value: 'n29ed', validate: () => true } };
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
      page.fields = { postcodeLookup: { value: 'n29ed', validate: () => true },
        postcodeAddress: { value: '2000', validate: () => true } };
      page.addressSuggestions.push('address 1', 'address2');
      pcl = new PCL(enabled, token, url, page);
      const alldFieldsSpy = sinon.spy(pcl, 'alldFields');
      await pcl.setPageState();
      expect(alldFieldsSpy).to.have.been.calledOnce;
      pcl.alldFields.restore();
    });

    it('setPageState auto postcodeAddressFields', async() => {
      page.fields = { postcodeLookup: { value: 'n29ed', validate: () => true } };
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
      const manualFiledsSpy = sinon.spy(pcl, 'manualFileds');
      const restoreValuesSpy = sinon.spy(pcl, 'restoreValues');
      await pcl.setPageState();
      expect(manualFiledsSpy).to.have.been.calledOnce;
      expect(restoreValuesSpy).to.have.been.calledTwice;
      pcl.manualFileds.restore();
      pcl.restoreValues.restore();
    });
  });

  describe('handlePostCodeLookup()', () => {
    it('handlePostCodeLookup adress options found', async() => {
      page.fields = { postcodeLookup: { value: 'n29ed', validate: () => true } };
      pcl = new PCL(enabled, token, url, page);
      await pcl.handlePostCodeLookup();
      expect(page.addressSuggestions.length).to.eql(2);
    });

    it('handlePostCodeLookup adress options found', async() => {
      page.fields = { postcodeLookup: { value: 'non valid', validate: () => true } };
      pcl = new PCL(enabled, token, url, page);
      await pcl.handlePostCodeLookup();
      expect(page.fields.postcodeLookup.value).to.eql('');
    });

    it('handlePostCodeLookup server not available', async() => {
      page.fields = { postcodeLookup: { value: 'n29ed', validate: () => true } };
      pcl = new PCL(enabled, token, 'non-valid-server', page);
      await pcl.handlePostCodeLookup();
      expect(page.fields.postcodeLookup.value).to.eql('');
    });

    it('handlePostCodeLookup server not valid token', async() => {
      page.fields = { postcodeLookup: { value: 'n29ed', validate: () => true } };
      pcl = new PCL(enabled, 'non-valid-token', url, page);
      await pcl.handlePostCodeLookup();
      expect(page.fields.postcodeLookup.value).to.eql('');
    });
  });

  describe('handleAddressSelection()', () => {
    beforeEach(() => {
      // eslint-disable-next-line max-len
      page.addressSuggestions = [{ DPA: { UPRN: '200206013', UDPRN: '15487017', ADDRESS: 'ROYALTY LOUNGE, 118, HIGH ROAD, LONDON, N2 9ED', ORGANISATION_NAME: 'ROYALTY LOUNGE', BUILDING_NUMBER: '118', THOROUGHFARE_NAME: 'HIGH ROAD', POST_TOWN: 'LONDON', POSTCODE: 'N2 9ED', RPC: '1', X_COORDINATE: 527279.68, Y_COORDINATE: 189550.65, STATUS: 'APPROVED', LOGICAL_STATUS_CODE: '1', CLASSIFICATION_CODE: 'CR07', CLASSIFICATION_CODE_DESCRIPTION: 'Restaurant / Cafeteria', LOCAL_CUSTODIAN_CODE: 5090, LOCAL_CUSTODIAN_CODE_DESCRIPTION: 'BARNET', POSTAL_ADDRESS_CODE: 'D', POSTAL_ADDRESS_CODE_DESCRIPTION: 'A record which is linked to PAF', BLPU_STATE_CODE_DESCRIPTION: 'Unknown/Not applicable', TOPOGRAPHY_LAYER_TOID: 'osgb1000005170873', LAST_UPDATE_DATE: '10/02/2016', ENTRY_DATE: '23/11/2005', LANGUAGE: 'EN', MATCH: 1, MATCH_DESCRIPTION: 'EXACT' } }];
      // eslint-disable-next-line max-len
      page.fields = { postcodeLookup: { value: 'n29ed', validate: () => true }, postcodeAddress: { value: '200206013', validate: () => true }, addressLine1: { value: '' }, addressLine2: { value: '' }, townCity: { value: '' }, county: { value: '' }, postCode: { value: '' } };
    });
    afterEach(() => {
      // eslint-disable-next-line max-len
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

  // describe('controller()', () => {
  //   it('controller lookup', () => {
  //     pcl.controller(req, res, next, page, superCallback);
  //   });

  //   it('controller addressSelection', () => {
  //     pcl.controller(req, res, next, page, superCallback);
  //   });

  //   it('controller manual', () => {
  //     pcl.controller(req, res, next, page, superCallback);
  //   });

  //   it('controller GET and Validate', () => {
  //     pcl.controller(req, res, next, page, superCallback);
  //   });

  //   it('controller GET and any Type', () => {
  //     pcl.controller(req, res, next, page, superCallback);
  //   });

  //   it('controller default', () => {
  //     pcl.controller(req, res, next, page, superCallback);
  //   });
  // });
});