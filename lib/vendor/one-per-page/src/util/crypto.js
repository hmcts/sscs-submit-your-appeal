const crypto = require('crypto');

const algorithm = 'AES-256-CBC';
const ivLength = 16;

const encryptData = (string = '', passwordHash) => {
  if (!passwordHash) {
    throw new Error('Cannot encrpyt data without a passwordHash');
  }

  const iv = Buffer.from(crypto.randomBytes(ivLength));
  const cipher = crypto.createCipheriv(algorithm, passwordHash, iv);

  let encryptedData = cipher.update(string, 'utf8', 'hex');
  encryptedData += cipher.final('hex');

  return {
    encryptedData,
    iv: iv.toString('hex')
  };
};

const decryptData = (encryptedData, passwordHash) => {
  if (!passwordHash) {
    throw new Error('Cannot decrypt data without a passwordHash');
  }
  /* eslint-disable no-prototype-builtins */
  const hasIv = encryptedData.hasOwnProperty('iv');
  /* eslint-disable no-prototype-builtins */
  const hasEncryptedData = encryptedData.hasOwnProperty('encryptedData');
  const isValidEncryptedData = hasIv && hasEncryptedData;

  if (!isValidEncryptedData) {
    throw new Error('Data is not encrypted so cannot decrypt');
  }

  const iv = Buffer.from(encryptedData.iv, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, passwordHash, iv);
  let decryptedString = decipher
    .update(encryptedData.encryptedData, 'hex', 'utf8');
  decryptedString += decipher.final('utf8');

  return decryptedString;
};

const createHash = key => {
  if (!key) {
    throw new Error('Cannot create hash if no key supplied');
  }
  const hash = crypto.createHash('md5')
    .update(key, 'utf-8')
    .digest('hex')
    .toUpperCase();
  return hash;
};

module.exports = {
  encryptData,
  decryptData,
  createHash
};
