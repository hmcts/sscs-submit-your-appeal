const session = require('express-session');
const {createCluster} = require('redis');

class RedisClusterSessionStore extends session.Store {
    constructor(options = {}) {
        super();

        this.prefix = options.prefix || 'sess:';
        this.ttl = options.ttl || 86400;

        if (!options.url) {
            throw new Error('Redis URL is required');
        }

        const redisUrl = new URL(options.url);

        this.client = createCluster({
            rootNodes: [
                {
                    url: options.url
                }
            ],
            defaults: {
                socket: {
                    tls: redisUrl.protocol === 'rediss:'
                }
            }
        });

        this.client.on('error', error => {
            console.error(
                `${new Date().toISOString()} Redis cluster error: ${error.message}`
            );
        });

        this.ready = this.client.connect();
    }

    getKey(sid) {
        return `${this.prefix}${sid}`;
    }

    getTTL(sessionData) {
        if (sessionData?.cookie?.maxAge) {
            return Math.ceil(sessionData.cookie.maxAge / 1000);
        }

        if (sessionData?.cookie?.expires) {
            const ttl = Math.ceil(
                (new Date(sessionData.cookie.expires).getTime() - Date.now()) / 1000
            );

            if (ttl > 0) {
                return ttl;
            }
        }

        return this.ttl;
    }

    async get(sid, callback) {
        try {
            await this.ready;

            const data = await this.client.get(this.getKey(sid));

            callback(null, data ? JSON.parse(data) : null);
        } catch (error) {
            callback(error);
        }
    }

    async set(sid, sessionData, callback) {
        try {
            await this.ready;

            await this.client.set(
                this.getKey(sid),
                JSON.stringify(sessionData),
                {
                    EX: this.getTTL(sessionData)
                }
            );

            callback(null);
        } catch (error) {
            callback(error);
        }
    }

    async destroy(sid, callback) {
        try {
            await this.ready;

            await this.client.del(this.getKey(sid));

            callback(null);
        } catch (error) {
            callback(error);
        }
    }

    async touch(sid, sessionData, callback) {
        try {
            await this.ready;

            await this.client.expire(
                this.getKey(sid),
                this.getTTL(sessionData)
            );

            callback(null);
        } catch (error) {
            callback(error);
        }
    }

    async all(callback) {
        try {
            await this.ready;

            const keys = await this.client.keys(`${this.prefix}*`);

            if (keys.length === 0) {
                callback(null, []);
                return;
            }

            const sessions = await Promise.all(
                keys.map(async key => {
                    const data = await this.client.get(key);
                    return data ? JSON.parse(data) : null;
                })
            );

            callback(null, sessions.filter(Boolean));
        } catch (error) {
            callback(error);
        }
    }

    async all(callback) {
        try {
            await this.ready;

            const sessions = [];

            for await (const key of this.client.scanIterator({
                MATCH: `${this.prefix}*`
            })) {
                const data = await this.client.get(key);

                if (!data) {
                    continue;
                }

                const sessionData = JSON.parse(data);
                sessionData.id = key.substring(this.prefix.length);

                sessions.push(sessionData);
            }

            callback(null, sessions);
        } catch (error) {
            callback(error);
        }
    }
}

module.exports = RedisClusterSessionStore;