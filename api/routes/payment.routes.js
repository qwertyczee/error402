const express = require('express');
const router = express.Router();
const {
    createCheckoutSession,
    getDonations,
    verifySession
} = require('../controllers/payment.controller');
const rateLimiter = require('../middlewares/rateLimit.middleware');

router.post('/create-session', rateLimiter, createCheckoutSession);
router.get('/donations', getDonations);
router.get('/verify-session/:sessionId', verifySession);

module.exports = router;
