'use strict';

const crypto = require('crypto');
const CONF = require('config');
const logger = require('logger');

const algorithm = 'aes-256-gcm';
const bufferSize = 16;
const iv = Buffer.alloc(bufferSize, 0);
const keyLen = 32;

const createToken = params => {
  const tokenKey = CONF.services.pcq.tokenKey;
  let encrypted = '';

  if (tokenKey) {
    logger.trace(
      `Using ${tokenKey === 'SERVICE_TOKEN_KEY' ? 'local' : 'Azure KV'} secret for PCQ token key`
    );
    // eslint-disable-next-line no-sync
    const key = crypto.scryptSync(tokenKey, 'salt', keyLen);
    // Convert all params to string before encrypting
    Object.keys(params).forEach(p => {
      params[p] = String(params[p]);
    });
    const strParams = JSON.stringify(params);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    encrypted = cipher.update(strParams, 'utf8', 'hex');
    encrypted += cipher.final('hex');
  } else {
    logger.trace('PCQ token key is missing.');
  }

  return encrypted;
};

module.exports = createToken;
