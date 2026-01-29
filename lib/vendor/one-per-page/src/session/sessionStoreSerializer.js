const crypto = require('../util/crypto');

const sessionStoreSerializer = key => {
  const passwordHash = crypto.createHash(key);

  return {
    parse: string => {
      const redisData = JSON.parse(string);
      const decryptedData = crypto.decryptData(redisData, passwordHash);
      return JSON.parse(decryptedData);
    },
    stringify: session => {
      const sessionStringified = JSON.stringify(session);
      const encryptedData = crypto
        .encryptData(sessionStringified, passwordHash);
      return JSON.stringify(encryptedData);
    }
  };
};

module.exports = { sessionStoreSerializer };
