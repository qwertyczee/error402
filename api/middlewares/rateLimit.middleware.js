const { rateLimit } = require('../config/redis');

const limiter = async (req, res, next) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const { success } = await rateLimit.limit(ip);

        if (!success) {
            return res.status(429).json({ error: 'Too Many Requests' });
        }
        next();
    } catch (error) {
        next();
    }
};

module.exports = limiter;
