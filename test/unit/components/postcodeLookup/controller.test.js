const { expect } = require('test/util/chai');
const sinon = require('sinon');
const pcl = require('components/postcodeLookup/controller');
const conf = require('config');

const enabled = conf.postcodeLookup.enabled === 'true';

describe('Components/controller.js', () => {
  let page = {};
  let req = {};
  // eslint-disable-next-line no-unused-vars
  let res = {};
  // eslint-disable-next-line no-unused-vars
  let next = {};
  // eslint-disable-next-line no-unused-vars
  let superCallback = {};

  beforeEach(() => {
    pcl.setEnabled(true);
    page = { parse: sinon.spy(), retrieve: sinon.spy(), addressSuggestions: [] };
    req = { body: {},
      query: { type: 'auto' },
      session: { addressSuggestions: [], postcodeLookupType: '' } };
    res = {};
    next = sinon.spy();
    superCallback = sinon.spy();
  });

  afterEach(() => {
    pcl.setEnabled(enabled);
    page = {};
    req = {};
    res = {};
    next = {};
    superCallback = {};
  });

  describe('helpers', () => {
    it('fieldmap context', () => {
      expect(pcl.fieldMap).to.eql({
        postcodeLookup: 'postCodeLookup',
        postcodeAddress: 'postcodeAddress',
        line1: 'addressLine1',
        line2: 'addressLine2',
        town: 'townCity',
        county: 'county',
        postCode: 'postCode'
      });
    });

    it('postcodeLookupFields disabled field count', () => {
      expect(pcl.postcodeLookupFields().length).to.eql(6);
    });

    it('postcodeAddressFields disabled field count', () => {
      expect(pcl.postcodeAddressFields().length).to.eql(5);
    });

    it('manualFileds disabled field count', () => {
      expect(pcl.manualFileds().length).to.eql(2);
    });

    it('alldFields disabled field count', () => {
      expect(pcl.alldFields().length).to.eql(0);
    });

    it('resetSuggestions()', () => {
      page.addressSuggestions.push('1st address');
      req.session.addressSuggestions.push('1st address');
      pcl.resetSuggestions(req, page);
      expect(page.addressSuggestions).to.eql([]);
      expect(req.session.addressSuggestions).to.eql([]);
    });
  });

  describe('getFormType()', () => {
    it('getFormType() manual', () => {
      req.query.type = 'manual';
      expect(pcl.getFormType(req)).to.eql('manual');
    });

    it('getFormType() auto', () => {
      req.query.type = 'auto';
      expect(pcl.getFormType(req)).to.eql('auto');
    });

    it('getFormType() enabled', () => {
      req.query = {};
      expect(pcl.getFormType(req)).to.eql('auto');
    });

    it('getFormType() disabled', () => {
      pcl.setEnabled(false);
      req.query = {};
      expect(pcl.getFormType(req)).to.eql('manual');
    });

    it('getFormType() manual from session', () => {
      req.query = {};
      req.session.postcodeLookupType = 'manual';
      expect(pcl.getFormType(req)).to.eql('manual');
    });

    it('getFormType() auto from session', () => {
      req.query = {};
      req.session.postcodeLookupType = 'auto';
      expect(pcl.getFormType(req)).to.eql('auto');
    });
  });

  describe('restoreValues()', () => {
    it('restoreValues() Get', () => {
      req.session = {};
      req.method = 'POST';
      req.query = {};
      req.session.postcodeLookupType = 'auto';
      pcl.restoreValues(page, req);
      expect(page.parse).to.have.been.calledOnce;
    });

    it('restoreValues() Post', () => {
      req.session = {};
      req.method = 'GET';
      req.query = {};
      req.session.postcodeLookupType = 'auto';
      pcl.restoreValues(page, req);
      expect(page.retrieve).to.have.been.calledOnce;
    });
  });

  // describe('setPageState()', () => {
  //   it('setPageState restore suggestion from session', () => {
  //     pcl.setPageState(req, page);
  //   });

  //   it('setPageState auto all fields', () => {
  //     pcl.setPageState(req, page);
  //   });

  //   it('setPageState auto postcodeAddressFields', () => {
  //     pcl.setPageState(req, page);
  //   });

  //   it('setPageState auto postcodeLookupFields', () => {
  //     pcl.setPageState(req, page);
  //   });

  //   it('setPageState manual', () => {
  //     pcl.setPageState(req, page);
  //   });
  // });

  // describe('handlePostCodeLookup()', () => {
  //   it('handlePostCodeLookup adress options found', () => {
  //     pcl.handlePostCodeLookup(req, page);
  //   });

  //   it('handlePostCodeLookup adress options not found', () => {
  //     pcl.handlePostCodeLookup(req, page);
  //   });
  // });

  // describe('handleAddressSelection()', () => {
  //   it('handleAddressSelection adress selected', () => {
  //     pcl.handleAddressSelection(req, page);
  //   });

  //   it('handleAddressSelection adress not selected', () => {
  //     pcl.handleAddressSelection(req, page);
  //   });
  // });

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