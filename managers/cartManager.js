"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose = require("mongoose");
const User = mongoose.model('users');
class CartManager {
    constructor() {
        /************************************/
        this.addToCart = (purchaseGroupID, amount, userID) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield User.findByIdAndUpdate(userID, {
                $push: {
                    cart: {
                        purchaseGroup: purchaseGroupID,
                        amount
                    }
                }
            });
        });
        this.removeFromCart = (purchaseGroupID, userID) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield User.findByIdAndUpdate(userID, {
                $pull: {
                    cart: {
                        purchaseGroup: purchaseGroupID
                    }
                }
            });
            return yield User.findByIdAndUpdate(userID);
        });
    }
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = CartManager;
//# sourceMappingURL=cartManager.js.map