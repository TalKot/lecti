import cartController from '../controllers/cartController'
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {

    app.post('/api/cart/add/', requireLogin, async (req, res) => {
        let {purchaseGroupID, amount} = req.body;
        let cartInstance = new cartController();
        await cartInstance.addToCart(res, purchaseGroupID, amount, req.user._id.toString());
    });
};
