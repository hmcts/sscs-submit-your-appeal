const { expect } = require('chai');
const sinon = require('sinon');
const redis = require('redis');
const session = require('express-session');

const STORE_PATH = '../../../../components/session/RedisClusterSessionStore';

describe('RedisClusterSessionStore', () => {
  let redisClient = null;
  let createClusterStub = null;
  let RedisClusterSessionStore = null;

  beforeEach(() => {
    redisClient = {
      connect: sinon.stub().resolves(),
      get: sinon.stub(),
      set: sinon.stub().resolves(),
      del: sinon.stub().resolves(),
      expire: sinon.stub().resolves(),
      scanIterator: sinon.stub(),
      on: sinon.stub()
    };

    createClusterStub = sinon
      .stub(redis, 'createCluster')
      .returns(redisClient);

    delete require.cache[require.resolve(STORE_PATH)];

    // eslint-disable-next-line global-require
    RedisClusterSessionStore = require(STORE_PATH);
  });

  afterEach(() => {
    sinon.restore();
    delete require.cache[require.resolve(STORE_PATH)];
  });

  describe('constructor', () => {
    it('should create a Redis cluster client using the supplied URL', () => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      expect(createClusterStub.calledOnce).to.equal(true);

      const options = createClusterStub.firstCall.args[0];

      expect(options.rootNodes).to.deep.equal([
        {
          url: 'redis://localhost:6379'
        }
      ]);

      expect(options.defaults.socket.tls).to.equal(false);
      expect(store.client).to.equal(redisClient);
      expect(redisClient.connect.calledOnce).to.equal(true);
    });

    it('should enable TLS for a rediss URL', () => {
      const store = new RedisClusterSessionStore({
        url: 'rediss://localhost:6380'
      });

      expect(createClusterStub.calledOnce).to.equal(true);

      const options = createClusterStub.firstCall.args[0];

      expect(options.rootNodes).to.deep.equal([
        {
          url: 'rediss://localhost:6380'
        }
      ]);

      expect(options.defaults.socket.tls).to.equal(true);
      expect(store.client).to.equal(redisClient);
    });

    it('should use the default prefix and TTL', () => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      expect(store.prefix).to.equal('sess:');
      expect(store.ttl).to.equal(86400);
    });

    it('should allow a custom prefix and TTL', () => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379',
        prefix: 'custom:',
        ttl: 3600
      });

      expect(store.prefix).to.equal('custom:');
      expect(store.ttl).to.equal(3600);
    });

    it('should extend express-session Store', () => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      expect(store).to.be.instanceOf(session.Store);
    });

    it('should throw when no Redis URL is supplied', () => {
      expect(() => new RedisClusterSessionStore()).to.throw(
        'Redis URL is required'
      );

      expect(createClusterStub.called).to.equal(false);
    });
  });

  describe('getKey', () => {
    it('should prefix the session ID', () => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      expect(store.getKey('abc123')).to.equal('sess:abc123');
    });

    it('should use a custom prefix', () => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379',
        prefix: 'session:'
      });

      expect(store.getKey('abc123')).to.equal('session:abc123');
    });
  });

  describe('getTTL', () => {
    it('should use cookie maxAge when available', () => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      const sessionData = {
        cookie: {
          maxAge: 3600000
        }
      };

      expect(store.getTTL(sessionData)).to.equal(3600);
    });

    it('should round cookie maxAge up to the nearest second', () => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      const sessionData = {
        cookie: {
          maxAge: 3501
        }
      };

      expect(store.getTTL(sessionData)).to.equal(4);
    });

    it('should calculate TTL from cookie expiry', () => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      const futureDate = new Date(Date.now() + 5000);

      const sessionData = {
        cookie: {
          expires: futureDate
        }
      };

      const ttl = store.getTTL(sessionData);

      expect(ttl).to.be.within(4, 6);
    });

    it('should use the default TTL when there is no maxAge or expires', () => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      const sessionData = {
        cookie: {}
      };

      expect(store.getTTL(sessionData)).to.equal(86400);
    });

    it('should use the default TTL when cookie is missing', () => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      expect(store.getTTL({})).to.equal(86400);
    });

    it('should use the default TTL when expiry is in the past', () => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      const sessionData = {
        cookie: {
          expires: new Date(Date.now() - 5000)
        }
      };

      expect(store.getTTL(sessionData)).to.equal(86400);
    });

    it('should use a custom default TTL', () => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379',
        ttl: 3600
      });

      expect(store.getTTL({ cookie: {} })).to.equal(3600);
    });
  });

  describe('get', () => {
    it('should retrieve and parse a session', async() => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      const sessionData = {
        cookie: {
          maxAge: 86400000
        },
        user: {
          id: '123'
        }
      };

      redisClient.get.resolves(JSON.stringify(sessionData));

      const done = sinon.spy();

      await store.get('abc123', done);

      expect(redisClient.get.calledOnceWith('sess:abc123')).to.equal(true);
      expect(done.calledOnce).to.equal(true);
      expect(done.firstCall.args[0]).to.equal(null);
      expect(done.firstCall.args[1]).to.deep.equal(sessionData);
    });

    it('should return null when the session does not exist', async() => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      redisClient.get.resolves(null);

      const done = sinon.spy();

      await store.get('abc123', done);

      expect(redisClient.get.calledOnceWith('sess:abc123')).to.equal(true);
      expect(done.calledOnce).to.equal(true);
      expect(done.firstCall.args[0]).to.equal(null);
      expect(done.firstCall.args[1]).to.equal(null);
    });

    it('should return an error when Redis get fails', async() => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      const error = new Error('Redis GET failed');

      redisClient.get.rejects(error);

      const done = sinon.spy();

      await store.get('abc123', done);

      expect(done.calledOnce).to.equal(true);
      expect(done.firstCall.args[0]).to.equal(error);
      expect(done.firstCall.args[1]).to.equal(undefined);
    });

    it('should return an error when session JSON is invalid', async() => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      redisClient.get.resolves('{invalid-json');

      const done = sinon.spy();

      await store.get('abc123', done);

      expect(done.calledOnce).to.equal(true);
      expect(done.firstCall.args[0]).to.be.instanceOf(SyntaxError);
      expect(done.firstCall.args[1]).to.equal(undefined);
    });
  });

  describe('set', () => {
    it('should store a session with the calculated TTL', async() => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      const sessionData = {
        cookie: {
          maxAge: 3600000
        },
        user: {
          id: '123'
        }
      };

      const done = sinon.spy();

      await store.set('abc123', sessionData, done);

      expect(
        redisClient.set.calledOnceWith(
          'sess:abc123',
          JSON.stringify(sessionData),
          {
            EX: 3600
          }
        )
      ).to.equal(true);

      expect(done.calledOnceWith(null)).to.equal(true);
    });

    it('should use the default TTL when the cookie has no maxAge', async() => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      const sessionData = {
        cookie: {},
        user: {
          id: '123'
        }
      };

      const done = sinon.spy();

      await store.set('abc123', sessionData, done);

      expect(
        redisClient.set.calledOnceWith(
          'sess:abc123',
          JSON.stringify(sessionData),
          {
            EX: 86400
          }
        )
      ).to.equal(true);

      expect(done.calledOnceWith(null)).to.equal(true);
    });

    it('should return an error when Redis set fails', async() => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      const error = new Error('Redis SET failed');

      redisClient.set.rejects(error);

      const done = sinon.spy();

      await store.set(
        'abc123',
        {
          cookie: {}
        },
        done
      );

      expect(done.calledOnce).to.equal(true);
      expect(done.firstCall.args[0]).to.equal(error);
    });
  });

  describe('destroy', () => {
    it('should delete a session', async() => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      const done = sinon.spy();

      await store.destroy('abc123', done);

      expect(redisClient.del.calledOnceWith('sess:abc123')).to.equal(true);
      expect(done.calledOnceWith(null)).to.equal(true);
    });

    it('should return an error when Redis delete fails', async() => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      const error = new Error('Redis DEL failed');

      redisClient.del.rejects(error);

      const done = sinon.spy();

      await store.destroy('abc123', done);

      expect(done.calledOnce).to.equal(true);
      expect(done.firstCall.args[0]).to.equal(error);
    });
  });

  describe('touch', () => {
    it('should update the session expiry', async() => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      const sessionData = {
        cookie: {
          maxAge: 3600000
        }
      };

      const done = sinon.spy();

      await store.touch('abc123', sessionData, done);

      expect(
        redisClient.expire.calledOnceWith('sess:abc123', 3600)
      ).to.equal(true);

      expect(done.calledOnceWith(null)).to.equal(true);
    });

    it('should use the default TTL when touching a session without maxAge', async() => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      const sessionData = {
        cookie: {}
      };

      const done = sinon.spy();

      await store.touch('abc123', sessionData, done);

      expect(
        redisClient.expire.calledOnceWith('sess:abc123', 86400)
      ).to.equal(true);

      expect(done.calledOnceWith(null)).to.equal(true);
    });

    it('should return an error when Redis expire fails', async() => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      const error = new Error('Redis EXPIRE failed');

      redisClient.expire.rejects(error);

      const done = sinon.spy();

      await store.touch(
        'abc123',
        {
          cookie: {}
        },
        done
      );

      expect(done.calledOnce).to.equal(true);
      expect(done.firstCall.args[0]).to.equal(error);
    });
  });

  describe('all', () => {
    it('should return all sessions', async() => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      const sessionOne = {
        cookie: {},
        user: {
          id: '123'
        }
      };

      const sessionTwo = {
        cookie: {},
        user: {
          id: '456'
        }
      };

      async function* scanSessions() {
        yield 'sess:abc123';
        yield 'sess:def456';
      }

      redisClient.scanIterator.returns(scanSessions());

      redisClient.get
        .onFirstCall()
        .resolves(JSON.stringify(sessionOne))
        .onSecondCall()
        .resolves(JSON.stringify(sessionTwo));

      const done = sinon.spy();

      await store.all(done);

      expect(redisClient.scanIterator.calledOnce).to.equal(true);
      expect(
        redisClient.scanIterator.calledOnceWith({
          MATCH: 'sess:*'
        })
      ).to.equal(true);

      expect(redisClient.get.callCount).to.equal(2);
      expect(redisClient.get.firstCall.args[0]).to.equal('sess:abc123');
      expect(redisClient.get.secondCall.args[0]).to.equal('sess:def456');

      expect(done.calledOnce).to.equal(true);
      expect(done.firstCall.args[0]).to.equal(null);

      expect(done.firstCall.args[1]).to.deep.equal([
        {
          ...sessionOne,
          id: 'abc123'
        },
        {
          ...sessionTwo,
          id: 'def456'
        }
      ]);
    });

    it('should ignore sessions that no longer exist', async() => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      async function* scanSessions() {
        yield 'sess:abc123';
        yield 'sess:def456';
      }

      redisClient.scanIterator.returns(scanSessions());

      redisClient.get
        .onFirstCall()
        .resolves(
          JSON.stringify({
            cookie: {},
            user: {
              id: '123'
            }
          })
        )
        .onSecondCall()
        .resolves(null);

      const done = sinon.spy();

      await store.all(done);

      expect(redisClient.get.callCount).to.equal(2);

      expect(done.calledOnce).to.equal(true);
      expect(done.firstCall.args[0]).to.equal(null);

      expect(done.firstCall.args[1]).to.deep.equal([
        {
          cookie: {},
          user: {
            id: '123'
          },
          id: 'abc123'
        }
      ]);
    });

    it('should return an empty array when there are no sessions', async() => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      async function* emptyScanIterator() {
        const keys = [];

        for (const key of keys) {
          yield key;
        }
      }

      redisClient.scanIterator.returns(emptyScanIterator());

      const done = sinon.spy();

      await store.all(done);

      expect(redisClient.scanIterator.calledOnce).to.equal(true);
      expect(redisClient.get.called).to.equal(false);

      expect(done.calledOnce).to.equal(true);
      expect(done.firstCall.args[0]).to.equal(null);
      expect(done.firstCall.args[1]).to.deep.equal([]);
    });

    it('should return an error when scanning fails', async() => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      const error = new Error('Redis SCAN failed');

      async function* failingScanIterator() {
        throw error;
      }

      redisClient.scanIterator.returns(failingScanIterator());

      const done = sinon.spy();

      await store.all(done);

      expect(done.calledOnce).to.equal(true);
      expect(done.firstCall.args[0]).to.equal(error);
      expect(done.firstCall.args[1]).to.equal(undefined);
    });

    it('should return an error when retrieving a session fails', async() => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      const error = new Error('Redis GET failed');

      async function* scanSessions() {
        yield 'sess:abc123';
      }

      redisClient.scanIterator.returns(scanSessions());
      redisClient.get.rejects(error);

      const done = sinon.spy();

      await store.all(done);

      expect(done.calledOnce).to.equal(true);
      expect(done.firstCall.args[0]).to.equal(error);
      expect(done.firstCall.args[1]).to.equal(undefined);
    });

    it('should return an error when session JSON is invalid', async() => {
      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      async function* scanSessions() {
        yield 'sess:abc123';
      }

      redisClient.scanIterator.returns(scanSessions());
      redisClient.get.resolves('{invalid-json');

      const done = sinon.spy();

      await store.all(done);

      expect(done.calledOnce).to.equal(true);
      expect(done.firstCall.args[0]).to.be.instanceOf(SyntaxError);
      expect(done.firstCall.args[1]).to.equal(undefined);
    });
  });

  describe('connection errors', () => {
    it('should log Redis cluster errors', () => {
      const consoleErrorStub = sinon.stub(console, 'error');

      const store = new RedisClusterSessionStore({
        url: 'redis://localhost:6379'
      });

      expect(store).to.be.instanceOf(session.Store);
      expect(redisClient.on.calledOnce).to.equal(true);
      expect(redisClient.on.firstCall.args[0]).to.equal('error');

      const errorHandler = redisClient.on.firstCall.args[1];
      const error = new Error('Redis connection failed');

      errorHandler(error);

      expect(consoleErrorStub.calledOnce).to.equal(true);
      expect(consoleErrorStub.firstCall.args[0]).to.include(
        'Redis cluster error: Redis connection failed'
      );

      consoleErrorStub.restore();
    });
  });
});