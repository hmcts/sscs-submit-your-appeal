const config = require('config');
const logger = require('logger');
const request = require('superagent');

const microservice = config.get('s2s.microservice');
const s2sUrl = config.get('s2s.url');
const timeout = config.get('s2s.timeout');

let token = '';

async function generateToken() {
  if (token) {
    return token;
  }

  try {
    const response = await request
      .post(`${s2sUrl}/testing-support/lease`)
      .set('Content-Type', 'application/json')
      .send({ microservice })
      .timeout(timeout);

    if (response && response.text) {
      token = response.text;
      logger.trace('Test S2S token generated');
      return token;
    }

    logger.trace('S2S generateToken returned empty response');
    return '';
  } catch (error) {
    logger.trace('Error generateToken', error);
    return '';
  }
}

function getCachedToken() {
  return token;
}

function clearTokenCache() {
  token = '';
}

module.exports = { generateToken, getCachedToken, clearTokenCache };
