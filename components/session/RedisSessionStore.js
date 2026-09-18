const session = require('express-session');
const { createClient, createCluster } = require('redis');

const DEFAULT_TTL_SECONDS = 86400;
const MILLISECONDS_PER_SECOND = 1000;

const isClusterEnabled = value => value === true || value === 'true';

class RedisSessionStore extends session.Store {
  constructor(options = {}) {
    super();

    this.prefix = options.prefix || 'sess:';
    this.ttl = options.ttl || DEFAULT_TTL_SECONDS;

    if (!options.url) {
      throw new Error('Redis URL is required');
    }

    const redisUrl = new URL(options.url);
    const cluster = isClusterEnabled(options.cluster);

    if (cluster) {
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
    } else {
      this.client = createClient({
        url: options.url,
        socket: {
          tls: redisUrl.protocol === 'rediss:'
        }
      });
    }

    this.client.on('error', error => {
      console.error(
        `${new Date().toISOString()} Redis ${cluster ? 'cluster ' : ''}error: ${error.message}`
      );
    });

    this.ready = this.client.connect();
  }

  getKey(sid) {
    return `${this.prefix}${sid}`;
  }

  getTTL(sessionData) {
    if (sessionData?.cookie?.maxAge) {
      return Math.ceil(
        sessionData.cookie.maxAge / MILLISECONDS_PER_SECOND
      );
    }

    if (sessionData?.cookie?.expires) {
      const ttl = Math.ceil(
        (new Date(sessionData.cookie.expires).getTime() - Date.now()) /
          MILLISECONDS_PER_SECOND
      );

      if (ttl > 0) {
        return ttl;
      }
    }

    return this.ttl;
  }

  async get(sid, done) {
    try {
      await this.ready;

      const sessionJson = await this.client.get(this.getKey(sid));

      if (done) {
        done(
          null,
          sessionJson ? JSON.parse(sessionJson) : null
        );
      }
    } catch (error) {
      if (done) {
        done(error);
      }
    }
  }

  async set(sid, sessionData, done) {
    try {
      await this.ready;

      await this.client.set(
        this.getKey(sid),
        JSON.stringify(sessionData),
        {
          EX: this.getTTL(sessionData)
        }
      );

      if (done) {
        done(null);
      }
    } catch (error) {
      if (done) {
        done(error);
      }
    }
  }

  async destroy(sid, done) {
    try {
      await this.ready;

      await this.client.del(this.getKey(sid));

      if (done) {
        done(null);
      }
    } catch (error) {
      if (done) {
        done(error);
      }
    }
  }

  async touch(sid, sessionData, done) {
    try {
      await this.ready;

      await this.client.expire(
        this.getKey(sid),
        this.getTTL(sessionData)
      );

      if (done) {
        done(null);
      }
    } catch (error) {
      if (done) {
        done(error);
      }
    }
  }

  async all(done) {
    try {
      await this.ready;

      const sessions = [];

      for await (const key of this.client.scanIterator({
        MATCH: `${this.prefix}*`
      })) {
        const sessionJson = await this.client.get(key);

        if (sessionJson) {
          const sessionData = JSON.parse(sessionJson);
          sessionData.id = key.substring(this.prefix.length);
          sessions.push(sessionData);
        }
      }

      if (done) {
        done(null, sessions);
      }
    } catch (error) {
      if (done) {
        done(error);
      }
    }
  }
}

module.exports = RedisSessionStore;