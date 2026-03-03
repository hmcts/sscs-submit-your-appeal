const config = require('config');
const logger = require('logger');
const request = require('superagent');
const { authenticator } = require('otplib');

const microservice = config.get('s2s.microservice');
const s2sSecret = config.get('s2s.secret');
const s2sUrl = config.get('s2s.url');
const timeout = config.get('s2s.timeout');

let token = '';
let tokenExpiry = 0;
// eslint-disable-next-line no-magic-numbers
const TOKEN_TTL = 1000 * 60 * 60;

async function generateToken() {
  const oneTimePassword = authenticator.generate(s2sSecret);
  try {
    const response = await request
      .post(`${s2sUrl}/lease`)
      .set('Content-Type', 'application/json')
      .send({ microservice, oneTimePassword })
      .timeout(timeout);

    token = response.text;
    tokenExpiry = Date.now() + TOKEN_TTL;
    return token;
  } catch (error) {
    logger.trace('Error generating S2S token', error);
    return '';
  }
}

async function getServiceAuthToken() {
  if (!token || Date.now() >= tokenExpiry) {
    await generateToken();
  }

  if (!token) {
    throw new Error('S2S token unavailable');
  }

  return token;
}

function initTokenRefresh() {
  getServiceAuthToken().catch(error => {
    logger.trace('Initial S2S token refresh failed', error);
  });
  setInterval(
    () =>
      getServiceAuthToken().catch(error => {
        logger.trace('Scheduled S2S token refresh failed', error);
      }),
    TOKEN_TTL
  );
}

module.exports = {
  generateToken,
  getServiceAuthToken,
  initTokenRefresh
};
