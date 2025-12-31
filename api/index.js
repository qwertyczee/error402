require('dotenv').config();

const express = require('express');
const cors = require('cors');
const paymentRoutes = require('./routes/payment.routes');
const { handleWebhook } = require('./controllers/payment.controller');

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST'],
        credentials: true,
    })
);

app.use(
    express.json({
        verify: (req, res, buf) => {
            req.rawBody = buf;
        },
    })
);

app.post('/api/webhook', handleWebhook);
app.use('/api', paymentRoutes);

// Export for Vercel
module.exports = app;

// Local dev support
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
}
