"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cartController_1 = require("../controllers/cartController");
const requireLogin = require('../middlewares/requireLogin');
module.exports = app => {
    app.post('/api/cart/add/', requireLogin, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { purchaseGroupID, amount } = req.body;
        const cartInstance = cartController_1.default.Instance;
        yield cartInstance.addToCart(res, purchaseGroupID, amount, req.user._id.toString());
    }));
    app.post('/api/cart/remove/:id', requireLogin, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const purchaseGroupID = req.params.id;
        const cartInstance = cartController_1.default.Instance;
        yield cartInstance.removeFromCart(res, purchaseGroupID, req.user._id);
    }));
};
//# sourceMappingURL=cartRoutes.js.map