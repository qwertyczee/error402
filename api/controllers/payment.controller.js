const Stripe = require('stripe');
const prisma = require('../config/db');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
    try {
        const { amount, message, donorName } = req.body;

        if (!amount || amount < 1) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const donation = await prisma.donation.create({
            data: {
                amount,
                message,
                donorName,
                status: 'pending',
            },
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Coffee Donation',
                            description: message || 'Support the creator',
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
            metadata: {
                donationId: donation.id,
            },
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const donationId = session.metadata.donationId;

        await prisma.donation.update({
            where: { id: donationId },
            data: { status: 'completed' },
        });
    }

    res.json({ received: true });
};

const getDonations = async (req, res) => {
    const donations = await prisma.donation.findMany({
        where: { status: 'completed' },
        orderBy: { createdAt: 'desc' },
        take: 20,
    });
    res.json(donations);
};

const verifySession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (!session || !session.metadata.donationId) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const donation = await prisma.donation.findUnique({
            where: { id: session.metadata.donationId }
        });

        res.json(donation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not verify session' });
    }
};

module.exports = { createCheckoutSession, handleWebhook, getDonations, verifySession };
