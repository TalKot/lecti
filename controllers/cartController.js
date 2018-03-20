"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const purchaseGroupManager_1 = require("../managers/purchaseGroupManager");
const userManager_1 = require("../managers/userManager");
// import cartManager from '../managers/cartManager';
const httpResponse_1 = require("../common/httpResponse");
class cartController {
    addToCart(res, purchaseGroupID, amount, userID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let purchaseGroupManagerInstance = new purchaseGroupManager_1.default();
                let userManagerInstance = new userManager_1.default();
                //check available amount for client to purchase
                const purchaseGroup = yield purchaseGroupManagerInstance.getPurchaseGroupById(purchaseGroupID);
                if (purchaseGroup) {
                    if (purchaseGroup.totalAmount < amount) {
                        const error = 'Amount is not available for this purchase group';
                        httpResponse_1.default.sendError(res, error);
                    }
                }
                // update records values
                purchaseGroupManagerInstance.addToCart(purchaseGroupID, amount, userID);
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
                let userManagerInstance = new userManager_1.default();
                // update records values & return updated user data
                const user = yield userManagerInstance.removeFromCart(purchaseGroupID, userID);
                user ? httpResponse_1.default.sendOk(res, user) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
    }
}
exports.default = cartController;
//# sourceMappingURL=cartController.js.map