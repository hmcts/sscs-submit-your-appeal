const sinon = require('sinon');
const { expect } = require('chai');
const redis = require('redis');

describe('RedisSessionStore', () => {
  let RedisSessionStore = null;
  let createClientStub = null;
  let createClusterStub = null;
  let redisClient = null;

  before(() => {
    redisClient = {
      connect: sinon.stub().resolves(),
      on: sinon.stub(),
      get: sinon.stub(),
      set: sinon.stub(),
      del: sinon.stub(),
      expire: sinon.stub(),
      scanIterator: sinon.stub()
    };

    redisClient.scanIterator.callsFake(async function* scanIterator() {
      yield 'sess:session-1';
    });

    createClientStub = sinon.stub(redis, 'createClient');
    createClusterStub = sinon.stub(redis, 'createCluster');

    createClientStub.returns(redisClient);
    createClusterStub.returns(redisClient);

    // eslint-disable-next-line global-require
    RedisSessionStore = require('../../../../components/session/RedisSessionStore');
  });

  beforeEach(() => {
    sinon.resetHistory();

    redisClient.connect.resolves();
    redisClient.get.resolves(null);
    redisClient.set.resolves('OK');
    redisClient.del.resolves(1);
    redisClient.expire.resolves(1);

    redisClient.scanIterator.callsFake(async function* scanIterator() {
      yield 'sess:session-1';
    });
  });

  after(() => {
    createClientStub.restore();
    createClusterStub.restore();
  });

  describe('constructor', () => {
    it('should throw an error when Redis URL is not provided', () => {
      expect(() => new RedisSessionStore()).to.throw(
        'Redis URL is required'
      );
    });

    it('should create a standalone Redis client when cluster is disabled', () => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379',
        cluster: false
      });

      expect(store).to.be.instanceOf(RedisSessionStore);
      expect(createClientStub.calledOnce).to.equal(true);
      expect(createClusterStub.called).to.equal(false);

      expect(
        createClientStub.calledWithMatch({
          url: 'redis://localhost:6379'
        })
      ).to.equal(true);
    });

    it('should create a standalone Redis client when cluster is set to false as a string', () => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379',
        cluster: 'false'
      });

      expect(store).to.be.instanceOf(RedisSessionStore);
      expect(createClientStub.calledOnce).to.equal(true);
      expect(createClusterStub.called).to.equal(false);
    });

    it('should create a Redis cluster client when cluster is enabled', () => {
      const store = new RedisSessionStore({
        url: 'rediss://:password@redis.example.com:6380',
        cluster: true
      });

      expect(store).to.be.instanceOf(RedisSessionStore);
      expect(createClusterStub.calledOnce).to.equal(true);
      expect(createClientStub.called).to.equal(false);

      expect(
        createClusterStub.calledWithMatch({
          rootNodes: [
            {
              url: 'rediss://:password@redis.example.com:6380'
            }
          ]
        })
      ).to.equal(true);
    });

    it('should create a Redis cluster client when cluster is set to true as a string', () => {
      const store = new RedisSessionStore({
        url: 'rediss://:password@redis.example.com:6380',
        cluster: 'true'
      });

      expect(store).to.be.instanceOf(RedisSessionStore);
      expect(createClusterStub.calledOnce).to.equal(true);
      expect(createClientStub.called).to.equal(false);
    });

    it('should configure TLS for a rediss URL', () => {
      const store = new RedisSessionStore({
        url: 'rediss://localhost:6380',
        cluster: false
      });

      expect(store).to.be.instanceOf(RedisSessionStore);
      expect(
        createClientStub.calledWithMatch({
          socket: {
            tls: true
          }
        })
      ).to.equal(true);
    });

    it('should not enable TLS for a redis URL', () => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379',
        cluster: false
      });

      expect(store).to.be.instanceOf(RedisSessionStore);
      expect(
        createClientStub.calledWithMatch({
          socket: {
            tls: false
          }
        })
      ).to.equal(true);
    });

    it('should connect to Redis during construction', () => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379',
        cluster: false
      });

      expect(store).to.be.instanceOf(RedisSessionStore);
      expect(redisClient.connect.calledOnce).to.equal(true);
    });

    it('should register a Redis error handler', () => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379',
        cluster: false
      });

      expect(store).to.be.instanceOf(RedisSessionStore);
      expect(redisClient.on.calledOnce).to.equal(true);
      expect(redisClient.on.firstCall.args[0]).to.equal('error');
    });
  });

  describe('getKey', () => {
    it('should return the session key using the default prefix', () => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      expect(store.getKey('abc123')).to.equal('sess:abc123');
    });

    it('should use a custom prefix when provided', () => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379',
        prefix: 'custom:'
      });

      expect(store.getKey('abc123')).to.equal('custom:abc123');
    });
  });

  describe('getTTL', () => {
    it('should use cookie maxAge when provided', () => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      expect(
        store.getTTL({
          cookie: {
            maxAge: 60000
          }
        })
      ).to.equal(60);
    });

    it('should round cookie maxAge up to the nearest second', () => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      expect(
        store.getTTL({
          cookie: {
            maxAge: 60500
          }
        })
      ).to.equal(61);
    });

    it('should use cookie expires when maxAge is not provided', () => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      const expires = new Date(Date.now() + 60000);

      expect(
        store.getTTL({
          cookie: {
            expires
          }
        })
      ).to.be.within(59, 61);
    });

    it('should use the default TTL when no cookie expiry is provided', () => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      expect(store.getTTL({ cookie: {} })).to.equal(86400);
    });

    it('should use a custom default TTL when provided', () => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379',
        ttl: 3600
      });

      expect(store.getTTL({ cookie: {} })).to.equal(3600);
    });

    it('should use the default TTL when cookie expiry has already passed', () => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      const expires = new Date(Date.now() - 60000);

      expect(
        store.getTTL({
          cookie: {
            expires
          }
        })
      ).to.equal(86400);
    });
  });

  describe('get', () => {
    it('should return null when the session does not exist', async() => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      redisClient.get.resolves(null);

      const done = sinon.spy();

      await store.get('session-1', done);

      expect(
        redisClient.get.calledWith('sess:session-1')
      ).to.equal(true);

      expect(done.calledOnceWith(null, null)).to.equal(true);
    });

    it('should return the parsed session when it exists', async() => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      const sessionData = {
        cookie: {
          maxAge: 3600000
        },
        userId: '123'
      };

      redisClient.get.resolves(JSON.stringify(sessionData));

      const done = sinon.spy();

      await store.get('session-1', done);

      expect(
        done.calledOnceWith(null, sessionData)
      ).to.equal(true);
    });

    it('should return an error when Redis get fails', async() => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      const error = new Error('Redis unavailable');

      redisClient.get.rejects(error);

      const done = sinon.spy();

      await store.get('session-1', done);

      expect(done.calledOnceWith(error)).to.equal(true);
    });

    it('should return an error when session JSON is invalid', async() => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      redisClient.get.resolves('invalid-json');

      const done = sinon.spy();

      await store.get('session-1', done);

      expect(done.calledOnce).to.equal(true);
      expect(done.firstCall.args[0]).to.be.an('error');
    });
  });

  describe('set', () => {
    it('should store the session as JSON with the calculated TTL', async() => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      const sessionData = {
        cookie: {
          maxAge: 60000
        },
        userId: '123'
      };

      const done = sinon.spy();

      await store.set('session-1', sessionData, done);

      expect(
        redisClient.set.calledOnceWith(
          'sess:session-1',
          JSON.stringify(sessionData),
          {
            EX: 60
          }
        )
      ).to.equal(true);

      expect(done.calledOnceWith(null)).to.equal(true);
    });

    it('should use the default TTL when the session has no expiry', async() => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      const sessionData = {
        cookie: {},
        userId: '123'
      };

      const done = sinon.spy();

      await store.set('session-1', sessionData, done);

      expect(
        redisClient.set.calledOnceWith(
          'sess:session-1',
          JSON.stringify(sessionData),
          {
            EX: 86400
          }
        )
      ).to.equal(true);

      expect(done.calledOnceWith(null)).to.equal(true);
    });

    it('should return an error when Redis set fails', async() => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      const error = new Error('Redis unavailable');

      redisClient.set.rejects(error);

      const done = sinon.spy();

      await store.set(
        'session-1',
        {
          cookie: {}
        },
        done
      );

      expect(done.calledOnceWith(error)).to.equal(true);
    });
  });

  describe('destroy', () => {
    it('should not fail when no callback is provided', async() => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      await store.destroy('session-1');

      expect(
        redisClient.del.calledOnceWith('sess:session-1')
      ).to.equal(true);
    });

    it('should delete the session', async() => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      const done = sinon.spy();

      await store.destroy('session-1', done);

      expect(
        redisClient.del.calledOnceWith('sess:session-1')
      ).to.equal(true);

      expect(done.calledOnceWith(null)).to.equal(true);
    });

    it('should return an error when Redis delete fails', async() => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      const error = new Error('Redis unavailable');

      redisClient.del.rejects(error);

      const done = sinon.spy();

      await store.destroy('session-1', done);

      expect(done.calledOnceWith(error)).to.equal(true);
    });
  });

  describe('touch', () => {
    it('should update the session TTL', async() => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      const sessionData = {
        cookie: {
          maxAge: 120000
        }
      };

      const done = sinon.spy();

      await store.touch('session-1', sessionData, done);

      expect(
        redisClient.expire.calledOnceWith('sess:session-1', 120)
      ).to.equal(true);

      expect(done.calledOnceWith(null)).to.equal(true);
    });

    it('should use the default TTL when the session has no expiry', async() => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      const sessionData = {
        cookie: {}
      };

      const done = sinon.spy();

      await store.touch('session-1', sessionData, done);

      expect(
        redisClient.expire.calledOnceWith('sess:session-1', 86400)
      ).to.equal(true);

      expect(done.calledOnceWith(null)).to.equal(true);
    });

    it('should return an error when Redis expire fails', async() => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      const error = new Error('Redis unavailable');

      redisClient.expire.rejects(error);

      const done = sinon.spy();

      await store.touch(
        'session-1',
        {
          cookie: {}
        },
        done
      );

      expect(done.calledOnceWith(error)).to.equal(true);
    });
  });

  describe('all', () => {
    it('should return all sessions', async() => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      const sessionData = {
        cookie: {
          maxAge: 3600000
        },
        userId: '123'
      };

      redisClient.scanIterator.callsFake(async function* scanIterator() {
        yield 'sess:session-1';
      });

      redisClient.get.resolves(JSON.stringify(sessionData));

      const done = sinon.spy();

      await store.all(done);

      expect(
        redisClient.get.calledWith('sess:session-1')
      ).to.equal(true);

      expect(done.calledOnce).to.equal(true);
      expect(done.firstCall.args[0]).to.equal(null);
      expect(done.firstCall.args[1]).to.deep.equal([
        {
          cookie: {
            maxAge: 3600000
          },
          userId: '123',
          id: 'session-1'
        }
      ]);
    });

    it('should return an empty array when there are no sessions', async() => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      redisClient.scanIterator.callsFake(async function* scanIterator() {
        // No sessions
      });

      const done = sinon.spy();

      await store.all(done);

      expect(done.calledOnceWith(null, [])).to.equal(true);
    });

    it('should ignore sessions that no longer exist', async() => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      redisClient.scanIterator.callsFake(async function* scanIterator() {
        yield 'sess:session-1';
      });

      redisClient.get.resolves(null);

      const done = sinon.spy();

      await store.all(done);

      expect(done.calledOnceWith(null, [])).to.equal(true);
    });

    it('should return an error when Redis scan fails', async() => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      const error = new Error('Redis unavailable');

      redisClient.scanIterator.throws(error);

      const done = sinon.spy();

      await store.all(done);

      expect(done.calledOnceWith(error)).to.equal(true);
    });

    it('should return an error when session JSON is invalid', async() => {
      const store = new RedisSessionStore({
        url: 'redis://localhost:6379'
      });

      redisClient.scanIterator.callsFake(async function* scanIterator() {
        yield 'sess:session-1';
      });

      redisClient.get.resolves('invalid-json');

      const done = sinon.spy();

      await store.all(done);

      expect(done.calledOnce).to.equal(true);
      expect(done.firstCall.args[0]).to.be.an('error');
    });
  });

  describe('cluster configuration', () => {
    it('should use the cluster client for production-style configuration', () => {
      const store = new RedisSessionStore({
        url: 'rediss://:password@managed-redis.example.com:6380',
        cluster: 'true'
      });

      expect(store).to.be.instanceOf(RedisSessionStore);
      expect(createClusterStub.calledOnce).to.equal(true);
      expect(createClientStub.called).to.equal(false);

      const clusterOptions = createClusterStub.firstCall.args[0];

      expect(clusterOptions.rootNodes).to.deep.equal([
        {
          url: 'rediss://:password@managed-redis.example.com:6380'
        }
      ]);

      expect(clusterOptions.defaults.socket.tls).to.equal(true);
    });

    it('should use the standalone client for Preview-style configuration', () => {
      const store = new RedisSessionStore({
        url: 'redis://hmcts-redis-master',
        cluster: 'false'
      });

      expect(store).to.be.instanceOf(RedisSessionStore);
      expect(createClientStub.calledOnce).to.equal(true);
      expect(createClusterStub.called).to.equal(false);

      const clientOptions = createClientStub.firstCall.args[0];

      expect(clientOptions.url).to.equal(
        'redis://hmcts-redis-master'
      );

      expect(clientOptions.socket.tls).to.equal(false);
    });
  });
});