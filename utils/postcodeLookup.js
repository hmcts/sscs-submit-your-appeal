
const rp = require('request-promise');
const conf = require('config');

const postCodeLookupUrl = conf.postcodeLookup.url;
const postCodeLookupToken = conf.postcodeLookup.token;
const { buildConcatenatedAddress } = require('utils/postcodeLookupHelper');

const getPostCodeSuggestions = postCode => {
  const options = {
    json: true,
    uri: `${postCodeLookupUrl}/addresses/postcode?postcode=${postCode}&key=${postCodeLookupToken}`,
    method: 'GET'
  };

  return rp(options);
};

const fillAddressForm = (req, instance, fieldMap) => {
  let selectedAddress = [];

  if (req.body.PostcodeLookupAddress && req.body.PostcodeLookupAddress !== '-1') {
    const bodySelected = req.body.PostcodeLookupAddress;
    // eslint-disable-next-line max-len
    selectedAddress = instance.postCodeLookupData.options.filter(address => address.DPA.UPRN === bodySelected);
  }

  if (selectedAddress.length === 1) {
    instance.postCodeLookupData.selected = selectedAddress[0].DPA.UPRN;
    instance.retrieve();

    const concatenated = buildConcatenatedAddress(selectedAddress[0]);

    instance.fields[fieldMap.line1].value = concatenated.line1;
    instance.fields[fieldMap.line2].value = concatenated.line2;
    instance.fields[fieldMap.town].value = concatenated.town;
    instance.fields[fieldMap.county].value = concatenated.county;
    instance.fields[fieldMap.postCode].value = concatenated.postCode;
    instance.store();
  }
};

const postCodeLookup = async(req, instance, fieldMap) => {
  instance.postCodeLookupData = {
    options: [],
    error: false,
    postCode: '',
    selected: ''
  };

  if (req.method === 'POST' && req.body.postCodeLookupPostCode) {
    let listOfAddresses = [];
    const bodyPostCode = req.body.postCodeLookupPostCode;
    instance.postCodeLookupData.postCode = bodyPostCode;

    // Get suggestions.
    listOfAddresses = await getPostCodeSuggestions(bodyPostCode).catch(() => {
      instance.postCodeLookupData.error = true;
    });

    if (listOfAddresses.results.length > 0) {
      instance.postCodeLookupData.options = listOfAddresses.results;
      // If Address Dropdown has selected fill the form
      fillAddressForm(req, instance, fieldMap);
    }

    instance.parse();
  }

  return instance.renderPage();
};

module.exports = { postCodeLookup };