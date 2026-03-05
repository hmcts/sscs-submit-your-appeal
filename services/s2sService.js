const { authenticator: defaultAuth } = require('otplib');
const defaultRequest = require('superagent');
const defaultLogger = require('logger');

class S2SService {
  constructor(options = {}) {
    this.config = options.config;
    this.request = options.request || defaultRequest;
    this.logger = options.logger || defaultLogger;
    this.authenticator = options.authenticator || defaultAuth;

    this.token = '';
    this.tokenExpiry = 0;
    // eslint-disable-next-line no-magic-numbers
    this.TOKEN_TTL = 1000 * 60 * 60;
  }

  async generateToken() {
    const s2sSecret = this.config.get('s2s.secret');
    const s2sUrl = this.config.get('s2s.url');
    const microservice = this.config.get('s2s.microservice');
    const timeout = this.config.get('s2s.timeout');

    const oneTimePassword = this.authenticator.generate(s2sSecret);

    try {
      const response = await this.request
        .post(`${s2sUrl}/lease`)
        .set('Content-Type', 'application/json')
        .send({ microservice, oneTimePassword })
        .timeout(timeout);

      this.token = response.text;
      this.tokenExpiry = Date.now() + this.TOKEN_TTL;
      return this.token;
    } catch (error) {
      this.logger.trace('Error generating S2S token', error);
      return '';
    }
  }

  async getServiceAuthToken() {
    if (!this.token || Date.now() >= this.tokenExpiry) {
      await this.generateToken();
    }

    if (!this.token) {
      throw new Error('S2S token unavailable');
    }
    return this.token;
  }

  initTokenRefresh() {
    const refresh = () =>
      this.getServiceAuthToken().catch(error => {
        this.logger.trace('S2S token refresh failed', error);
      });

    refresh();
    return setInterval(refresh, this.TOKEN_TTL);
  }
}

module.exports = S2SService;
