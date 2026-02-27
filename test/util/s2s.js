const config = require('config');
const logger = require('logger');
const request = require('superagent');

const microservice = config.get('s2s.microservice');
const s2sUrl = config.get('s2s.url');

async function generateToken() {
  try {
    const response = await request
      .post(`${s2sUrl}/testing-support/lease`)
      .set('Content-Type', 'application/json')
      .send({ microservice })
      .timeout(40000); // 40 seconds

    return response.body;
  } catch (error) {
    logger.error('Error generateToken', error);
    return '';
  }
}

module.exports = { generateToken };
