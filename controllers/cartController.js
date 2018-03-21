"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const purchaseGroupManager_1 = require("../managers/purchaseGroupManager");
const userManager_1 = require("../managers/userManager");
const cartManager_1 = require("../managers/cartManager");
const httpResponse_1 = require("../common/httpResponse");
class CartController {
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    /************************************/
    addToCart(res, purchaseGroupID, amount, userID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const purchaseGroupManagerInstance = purchaseGroupManager_1.default.Instance;
                const cartManagerInstance = cartManager_1.default.Instance;
                const userManagerInstance = userManager_1.default.Instance;
                //check available amount for client to purchase
                const purchaseGroup = yield purchaseGroupManagerInstance.getPurchaseGroupById(purchaseGroupID);
                if (purchaseGroup) {
                    if (purchaseGroup.totalAmount < amount) {
                        const error = 'Amount is not available for this purchase group';
                        httpResponse_1.default.sendError(res, error);
                    }
                }
                // update records values
                yield cartManagerInstance.addToCart(purchaseGroupID, amount, userID);
                //return updated user data
                let user = yield userManagerInstance.getUser(userID);
                user ? httpResponse_1.default.sendOk(res, user) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
    }
    removeFromCart(res, purchaseGroupID, userID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const cartManagerInstance = cartManager_1.default.Instance;
                // update records values & return updated user data
                const user = yield cartManagerInstance.removeFromCart(purchaseGroupID, userID);
                user ? httpResponse_1.default.sendOk(res, user) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
    }
}
exports.default = CartController;
//# sourceMappingURL=cartController.js.map