const config = require('config');
const logger = require('logger');
const request = require('superagent');
const { totp } = require('otplib');

const microservice = config.get('s2s.microservice');
const s2sSecret = config.get('s2s.secret');
const s2sUrl = config.get('s2s.url');
const timeout = config.get('s2s.timeout');

async function generateToken() {
  const oneTimePassword = totp.generate(s2sSecret);
  try {
    const response = await request
      .post(`${s2sUrl}/lease`)
      .set('Content-Type', 'application/json')
      .send({ microservice, oneTimePassword })
      .timeout(timeout);

    return response.body;
  } catch (error) {
    logger.trace('Error generateToken', error);
    return '';
  }
}

module.exports = { generateToken };
