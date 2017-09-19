const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiJq = require('chai-jq');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(chaiJq);

module.exports = { expect: chai.expect, sinon };
