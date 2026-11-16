const { expect, sinon } = require('test/util/chai');
const crypto = require('lib/vendor/one-per-page/src/util/crypto');

const { sessionStoreSerializer } = require(
  'lib/vendor/one-per-page/src/session/sessionStoreSerializer'
);

const sampleData = {
  foo: 'foo',
  bar: 'bar'
};
const sampleKey = 'thisIsMyKey';

describe('session/sessionStoreSerializer', () => {
  describe('presents an serializer object', () => {
    let serializer = null;
    let spy = null;
    beforeEach(() => {
      spy = sinon.spy(crypto, 'createHash');
      serializer = sessionStoreSerializer(sampleKey);
    });
    afterEach(() => {
      spy.restore();
    });
    it('presents an serializer object', () => {
      expect(Object.prototype.hasOwnProperty.call(serializer, 'parse')).to.eql(true);
      expect(Object.prototype.hasOwnProperty.call(serializer, 'stringify')).to.eql(true);
    });
    it('creates a password hash', () => {
      expect(spy).calledWith(sampleKey);
    });
  });
  describe('#parse', () => {
    let parse = null;
    beforeEach(() => {
      parse = sessionStoreSerializer(sampleKey).parse;
    });
    it('parses encrypted data', () => {
      const passwordHash = crypto.createHash(sampleKey);
      const encryptedData = crypto.encryptData(
        JSON.stringify(sampleData),
        passwordHash
      );
      const parsedData = parse(JSON.stringify(encryptedData));
      expect(parsedData).to.eql(sampleData);
    });
  });
  describe('#stringify', () => {
    let stringify = null;
    beforeEach(() => {
      stringify = sessionStoreSerializer(sampleKey).stringify;
    });
    it('encrypts session and returns it as string', () => {
      const stringifyiedData = stringify(sampleData);
      expect(Object.prototype.hasOwnProperty.call(JSON.parse(stringifyiedData), 'iv'))
        .to.eql(true);
      expect(Object.prototype.hasOwnProperty.call(JSON.parse(stringifyiedData), 'encryptedData'))
        .to.eql(true);
    });
  });
});
