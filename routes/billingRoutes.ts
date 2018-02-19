const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
    app.post('/api/stripe', requireLogin, async (req, res) => {
        const userID = req.user.id;
        const token = req.body.token.id;
        const amount = req.body.amount;

        const charge = await stripe.charges.create({
            amount: amount * 100,
            currency: 'usd',
            description: `${userID} credit ${amount}$`,
            source: token
        });

        req.user.credits += amount;
        const user = await req.user.save();

        res.send(user);
    });
};
