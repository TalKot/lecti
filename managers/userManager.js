"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose = require("mongoose");
const User = mongoose.model('users');
const PurchaseGroup = mongoose.model('purchaseGroups');
class userManager {
    getUser(userID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield User.findById(userID);
            return user ? user : null;
        });
    }
    //TODO: SHOULD ADD INTERFACE OF PURCHASEGROUP
    addPurchaseGroupToUser(purchaseGroup, amount, userID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const cost = amount * purchaseGroup.priceForGroup;
            yield User.findByIdAndUpdate(userID, {
                $push: {
                    purchaseGroupsBought: {
                        purchaseGroup: purchaseGroup.id,
                        amount: amount
                    }
                },
                $inc: {
                    credits: -cost
                }
            });
            // const user = await User.findById(userID);
            // return user ? user : null;
        });
    }
}
exports.default = userManager;
//# sourceMappingURL=userManager.js.map