var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');
module.exports = app => {
    app.post('/api/stripe', requireLogin, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const userID = req.user.id;
        const token = req.body.token.id;
        const amount = req.body.amount;
        const charge = yield stripe.charges.create({
            amount: amount * 100,
            currency: 'usd',
            description: `${userID} credit ${amount}$`,
            source: token
        });
        req.user.credits += amount;
        const user = yield req.user.save();
        res.send(user);
    }));
};
//# sourceMappingURL=billingRoutes.js.map