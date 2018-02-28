"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cartController_1 = require("../controllers/cartController");
const requireLogin = require('../middlewares/requireLogin');
module.exports = app => {
    app.post('/api/cart/add/', requireLogin, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let { purchaseGroupID, amount } = req.body;
        let cartInstance = new cartController_1.default();
        yield cartInstance.addToCart(res, purchaseGroupID, amount, req.user._id.toString());
    }));
};
//# sourceMappingURL=cartRoutes.js.map