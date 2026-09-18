const {expect} = require('test/util/chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('RedisClusterSessionStore', () => {
    let RedisClusterSessionStore;
    let redisClient;
    let createCluster;

    before(() => {
        redisClient = {
            on: sinon.stub(),
            connect: sinon.stub().resolves(),
            get: sinon.stub(),
            set: sinon.stub().resolves(),
            del: sinon.stub().resolves(),
            expire: sinon.stub().resolves(),
            keys: sinon.stub(),
            scanIterator: null
        };

        createCluster = sinon.stub().returns(redisClient);

        RedisClusterSessionStore = proxyquire(
            'components/session/RedisClusterSessionStore',
            {
                redis: {
                    createCluster
                }
            }
        );
    });

    beforeEach(() => {
        sinon.resetHistory();

        redisClient.get.reset();
        redisClient.set.reset();
        redisClient.del.reset();
        redisClient.expire.reset();
        redisClient.keys.reset();

        redisClient.connect.reset();
        redisClient.connect.resolves();
    });

    after(() => {
        sinon.restore();
    });

    describe('constructor', () => {
        it('throws when Redis URL is not provided', () => {
            expect(() => new RedisClusterSessionStore()).to.throw(
                'Redis URL is required'
            );
        });

        it('creates a Redis cluster client', async () => {
            const store = new RedisClusterSessionStore({
                url: 'redis://localhost:6379'
            });

            await store.ready;

            expect(createCluster.calledOnce).to.equal(true);
            expect(redisClient.connect.calledOnce).to.equal(true);
        });

        it('configures TLS when using a rediss URL', async () => {
            const store = new RedisClusterSessionStore({
                url: 'rediss://localhost:6380'
            });

            await store.ready;

            expect(createCluster.calledOnce).to.equal(true);

            const clusterOptions = createCluster.firstCall.args[0];

            expect(clusterOptions.rootNodes).to.deep.equal([
                {
                    url: 'rediss://localhost:6380'
                }
            ]);

            expect(clusterOptions.defaults.socket.tls).to.equal(true);

            // Prevent unused variable warning in some lint configurations.
            expect(store).to.be.ok;
        });

        it('does not enable TLS when using a redis URL', async () => {
            const store = new RedisClusterSessionStore({
                url: 'redis://localhost:6379'
            });

            await store.ready;

            const clusterOptions = createCluster.firstCall.args[0];

            expect(clusterOptions.defaults.socket.tls).to.equal(false);

            expect(store).to.be.ok;
        });
    });

    describe('getKey()', () => {
        it('uses the default session prefix', () => {
            const store = new RedisClusterSessionStore({
                url: 'redis://localhost:6379'
            });

            expect(store.getKey('abc')).to.equal('sess:abc');
        });

        it('uses a custom session prefix', () => {
            const store = new RedisClusterSessionStore({
                url: 'redis://localhost:6379',
                prefix: 'custom:'
            });

            expect(store.getKey('abc')).to.equal('custom:abc');
        });
    });

    describe('get()', () => {
        it('returns null when the session does not exist', async () => {
            redisClient.get.resolves(null);

            const store = new RedisClusterSessionStore({
                url: 'redis://localhost:6379'
            });

            const callback = sinon.spy();

            await store.get('abc', callback);

            expect(redisClient.get.calledWith('sess:abc')).to.equal(true);
            expect(callback.calledOnceWithExactly(null, null)).to.equal(true);
        });

        it('returns the deserialised session', async () => {
            const sessionData = {
                cookie: {
                    maxAge: 86400000
                },
                BenefitType: {
                    benefitType: 'ESA'
                }
            };

            redisClient.get.resolves(JSON.stringify(sessionData));

            const store = new RedisClusterSessionStore({
                url: 'redis://localhost:6379'
            });

            const callback = sinon.spy();

            await store.get('abc', callback);

            expect(redisClient.get.calledWith('sess:abc')).to.equal(true);
            expect(callback.calledOnceWithExactly(null, sessionData)).to.equal(true);
        });

        it('passes Redis errors to the callback', async () => {
            const error = new Error('Redis unavailable');

            redisClient.get.rejects(error);

            const store = new RedisClusterSessionStore({
                url: 'redis://localhost:6379'
            });

            const callback = sinon.spy();

            await store.get('abc', callback);

            expect(callback.calledOnceWithExactly(error)).to.equal(true);
        });
    });

    describe('set()', () => {
        it('stores the session with the default TTL', async () => {
            const sessionData = {
                cookie: {}
            };

            const store = new RedisClusterSessionStore({
                url: 'redis://localhost:6379'
            });

            const callback = sinon.spy();

            await store.set('abc', sessionData, callback);

            expect(
                redisClient.set.calledWith(
                    'sess:abc',
                    JSON.stringify(sessionData),
                    {
                        EX: 86400
                    }
                )
            ).to.equal(true);

            expect(callback.calledOnceWithExactly(null)).to.equal(true);
        });

        it('uses the cookie maxAge as the TTL', async () => {
            const sessionData = {
                cookie: {
                    maxAge: 60000
                }
            };

            const store = new RedisClusterSessionStore({
                url: 'redis://localhost:6379'
            });

            const callback = sinon.spy();

            await store.set('abc', sessionData, callback);

            expect(
                redisClient.set.calledWith(
                    'sess:abc',
                    JSON.stringify(sessionData),
                    {
                        EX: 60
                    }
                )
            ).to.equal(true);

            expect(callback.calledOnceWithExactly(null)).to.equal(true);
        });

        it('passes Redis errors to the callback', async () => {
            const error = new Error('Redis unavailable');

            redisClient.set.rejects(error);

            const store = new RedisClusterSessionStore({
                url: 'redis://localhost:6379'
            });

            const callback = sinon.spy();

            await store.set(
                'abc',
                {
                    cookie: {}
                },
                callback
            );

            expect(callback.calledOnceWithExactly(error)).to.equal(true);
        });
    });

    describe('destroy()', () => {
        it('deletes the session', async () => {
            const store = new RedisClusterSessionStore({
                url: 'redis://localhost:6379'
            });

            const callback = sinon.spy();

            await store.destroy('abc', callback);

            expect(redisClient.del.calledWith('sess:abc')).to.equal(true);
            expect(callback.calledOnceWithExactly(null)).to.equal(true);
        });

        it('passes Redis errors to the callback', async () => {
            const error = new Error('Redis unavailable');

            redisClient.del.rejects(error);

            const store = new RedisClusterSessionStore({
                url: 'redis://localhost:6379'
            });

            const callback = sinon.spy();

            await store.destroy('abc', callback);

            expect(callback.calledOnceWithExactly(error)).to.equal(true);
        });
    });

    describe('touch()', () => {
        it('refreshes the session using the default TTL', async () => {
            const sessionData = {
                cookie: {}
            };

            const store = new RedisClusterSessionStore({
                url: 'redis://localhost:6379'
            });

            const callback = sinon.spy();

            await store.touch('abc', sessionData, callback);

            expect(
                redisClient.expire.calledWith('sess:abc', 86400)
            ).to.equal(true);

            expect(callback.calledOnceWithExactly(null)).to.equal(true);
        });

        it('uses the cookie maxAge when refreshing the TTL', async () => {
            const sessionData = {
                cookie: {
                    maxAge: 60000
                }
            };

            const store = new RedisClusterSessionStore({
                url: 'redis://localhost:6379'
            });

            const callback = sinon.spy();

            await store.touch('abc', sessionData, callback);

            expect(
                redisClient.expire.calledWith('sess:abc', 60)
            ).to.equal(true);

            expect(callback.calledOnceWithExactly(null)).to.equal(true);
        });

        it('passes Redis errors to the callback', async () => {
            const error = new Error('Redis unavailable');

            redisClient.expire.rejects(error);

            const store = new RedisClusterSessionStore({
                url: 'redis://localhost:6379'
            });

            const callback = sinon.spy();

            await store.touch(
                'abc',
                {
                    cookie: {}
                },
                callback
            );

            expect(callback.calledOnceWithExactly(error)).to.equal(true);
        });
    });

    describe('getTTL()', () => {
        let store;

        beforeEach(() => {
            store = new RedisClusterSessionStore({
                url: 'redis://localhost:6379'
            });
        });

        it('uses cookie maxAge when available', () => {
            expect(
                store.getTTL({
                    cookie: {
                        maxAge: 60000
                    }
                })
            ).to.equal(60);
        });

        it('uses the default TTL when cookie expiry is unavailable', () => {
            expect(
                store.getTTL({
                    cookie: {}
                })
            ).to.equal(86400);
        });

        it('uses cookie expires when maxAge is unavailable', () => {
            const expires = new Date(Date.now() + 60000);

            const ttl = store.getTTL({
                cookie: {
                    expires
                }
            });

            expect(ttl).to.be.within(59, 60);
        });

        it('uses the default TTL when cookie expires is in the past', () => {
            const expires = new Date(Date.now() - 60000);

            expect(
                store.getTTL({
                    cookie: {
                        expires
                    }
                })
            ).to.equal(86400);
        });

        it('uses a custom default TTL', () => {
            const customStore = new RedisClusterSessionStore({
                url: 'redis://localhost:6379',
                ttl: 3600
            });

            expect(
                customStore.getTTL({
                    cookie: {}
                })
            ).to.equal(3600);
        });
    });

    describe('all()', () => {
        it('returns an empty array when there are no sessions', async () => {
            redisClient.scanIterator = async function* () {
                // No keys
            };

            const store = new RedisClusterSessionStore({
                url: 'redis://localhost:6379'
            });

            const callback = sinon.spy();

            await store.all(callback);

            expect(callback.calledOnceWithExactly(null, [])).to.equal(true);
        });

        it('returns all sessions with their session ids', async () => {
            redisClient.scanIterator = async function* () {
                yield 'sess:abc';
                yield 'sess:def';
            };

            redisClient.get.withArgs('sess:abc').resolves(
                JSON.stringify({
                    cookie: {},
                    benefitType: 'ESA'
                })
            );

            redisClient.get.withArgs('sess:def').resolves(
                JSON.stringify({
                    cookie: {},
                    benefitType: 'PIP'
                })
            );

            const store = new RedisClusterSessionStore({
                url: 'redis://localhost:6379'
            });

            const callback = sinon.spy();

            await store.all(callback);

            expect(
                callback.calledOnceWithExactly(null, [
                    {
                        cookie: {},
                        benefitType: 'ESA',
                        id: 'abc'
                    },
                    {
                        cookie: {},
                        benefitType: 'PIP',
                        id: 'def'
                    }
                ])
            ).to.equal(true);
        });

        it('passes Redis errors to the callback', async () => {
            redisClient.scanIterator = async function* () {
                throw new Error('Redis unavailable');
            };

            const store = new RedisClusterSessionStore({
                url: 'redis://localhost:6379'
            });

            const callback = sinon.spy();

            await store.all(callback);

            expect(callback.calledOnce).to.equal(true);
            expect(callback.firstCall.args[0].message).to.equal(
                'Redis unavailable'
            );
        });
    });
});

