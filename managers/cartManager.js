"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose = require("mongoose");
const User = mongoose.model('users');
class CartManager {
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    /************************************/
    addToCart(purchaseGroupID, amount, userID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield User.findByIdAndUpdate(userID, {
                $push: {
                    cart: {
                        purchaseGroup: purchaseGroupID,
                        amount
                    }
                }
            });
        });
    }
    removeFromCart(purchaseGroupID, userID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
}
exports.default = CartManager;
//# sourceMappingURL=cartManager.js.map