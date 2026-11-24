const { expect } = require('test/util/chai');

const {
  encryptData,
  decryptData,
  createHash
} = require('lib/vendor/one-per-page/src/util/crypto');

const sampleData = {
  foo: 'foo',
  bar: 'bar'
};
const sampleKey = 'thisIsMyKey';

describe('util/crypto', () => {
  describe('#encryptData', () => {
    it('returns encrypted data', () => {
      const dataToEncrypt = JSON.stringify(sampleData);
      const passwordHash = createHash(sampleKey);
      const encryptedData = encryptData(dataToEncrypt, passwordHash);
      expect(Object.prototype.hasOwnProperty.call(encryptedData, 'iv')).to.eql(true);
      expect(Object.prototype.hasOwnProperty.call(encryptedData, 'encryptedData')).to.eql(true);
    });
    it('throws an error if no passwordHash supplied', () => {
      const dataToEncrypt = JSON.stringify(sampleData);
      const willThrow = () => encryptData(dataToEncrypt);
      expect(willThrow).to.throw('Cannot encrpyt data without a passwordHash');
    });
  });
  describe('#decryptData', () => {
    const dataToEncrypt = JSON.stringify(sampleData);
    const passwordHash = createHash(sampleKey);
    let encryptedData = '';
    beforeEach(() => {
      encryptedData = encryptData(dataToEncrypt, passwordHash);
    });
    it('returns decryptData data', () => {
      const decryptedData = decryptData(encryptedData, passwordHash);
      expect(decryptedData).to.eql(JSON.stringify(sampleData));
    });
    it('throws an error if no passwordHash supplied', () => {
      const willThrow = () => decryptData(encryptedData);
      expect(willThrow).to.throw('Cannot decrypt data without a passwordHash');
    });
    it('throws an error if no iv supplied in encrpyted data', () => {
      const invalidEncryptedData = {};
      invalidEncryptedData.encryptedData = encryptedData.encryptedData;
      const willThrow = () => decryptData(invalidEncryptedData, passwordHash);
      expect(willThrow).to.throw('Data is not encrypted so cannot decrypt');
    });
    it('throws an error if no encryptedData supplied in encrpyted data', () => {
      const invalidEncryptedData = { iv: 'sampleIv' };
      const willThrow = () => decryptData(invalidEncryptedData, passwordHash);
      expect(willThrow).to.throw('Data is not encrypted so cannot decrypt');
    });
  });
  describe('#createHash', () => {
    it('returns hash with a given key', () => {
      const passwordHash = createHash(sampleKey);
      expect(passwordHash).to.eql('F2746508D5804BCE0EE0D72570FDFDB6');
    });
    it('throws an error if no key supplied', () => {
      const willThrow = () => createHash();
      expect(willThrow).to.throw('Cannot create hash if no key supplied');
    });
  });
});
