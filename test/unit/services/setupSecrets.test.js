const { expect } = require('chai');
const { cloneDeep } = require('lodash');
const config = require('config');
const proxyquire = require('proxyquire');

const modulePath = 'services/setupSecrets';

let mockConfig = {};

describe(modulePath, () => {
  describe('#setup', () => {
    beforeEach(() => {
      mockConfig = cloneDeep(config);
    });

    it('should set config values when secrets path is set', () => {
      mockConfig.secrets = {
        sscs: {
          'session-secret': 'sessionValue',
          'sscs-redis-access-key': 'redisValue',
          'idam-sscs-oauth2-client-secret': 'idamValue',
          'postcode-lookup-token': 'osPlacesValue'
        }
      };

      // Update config with secret setup
      const setupSecrets = proxyquire(modulePath, { config: mockConfig });
      setupSecrets();

      expect(mockConfig.redis.secret).to.equal(
        mockConfig.secrets.sscs['sscs-redis-access-key']
      );
      expect(mockConfig.services.idam.secret).to.equal(
        mockConfig.secrets.sscs['idam-sscs-oauth2-client-secret']
      );
      expect(mockConfig.postcodeLookup.token).to.equal(
        mockConfig.secrets.sscs['postcode-lookup-token']
      );
    });

    it('should not set config values when secrets path is not set', () => {
      // Update config with secret setup
      const setupSecrets = proxyquire(modulePath, { config: mockConfig });
      setupSecrets();

      expect(mockConfig.redis.secret).to.equal(config.redis.secret);
      expect(mockConfig.redis.secret).to.equal(config.redis.secret);
      expect(mockConfig.services.idam.secret).to.equal(
        config.services.idam.secret
      );
    });

    it('should only set one config value when single secret path is set', () => {
      mockConfig.secrets = {
        sscs: { 'idam-sscs-oauth2-client-secret': 'idamValue' }
      };

      // Update config with secret setup
      const setupSecrets = proxyquire(modulePath, { config: mockConfig });
      setupSecrets();

      expect(mockConfig.redis.secret).to.equal(config.redis.secret);
      expect(mockConfig.redis.secret).to.equal(config.redis.secret);
      expect(mockConfig.services.idam.secret).to.not.equal(
        config.services.idam.secret
      );
      expect(mockConfig.services.idam.secret).to.equal(
        mockConfig.secrets.sscs['idam-sscs-oauth2-client-secret']
      );
    });
  });
});
