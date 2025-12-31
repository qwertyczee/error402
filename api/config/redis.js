const { Redis } = require('@upstash/redis');
const { Ratelimit } = require('@upstash/ratelimit');

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const rateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    analytics: true,
});

module.exports = { redis, rateLimit };
