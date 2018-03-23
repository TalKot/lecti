"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose = require("mongoose");
const _ = require("lodash");
const User = mongoose.model('users');
const PurchaseGroup = mongoose.model('purchaseGroups');
class UserManager {
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    /************************************/
    getUser(userID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield User.findById(userID)
                .populate({
                path: 'purchaseGroupsSell',
                model: 'purchaseGroups'
            });
            return user ? user : null;
        });
    }
    getUserSeller(userID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield User.findById(userID, {
                comments: 1,
                displayName: 1,
                email: 1,
                gender: 1,
                photoURL: 1,
                purchaseGroupsSell: 1
            })
                .populate({
                path: 'purchaseGroupsSell',
                model: 'purchaseGroups'
            })
                .populate({
                path: 'comments',
                model: 'comments',
                populate: {
                    path: 'user',
                    model: 'users',
                    select: ["displayName", "_id"]
                }
            });
            return user ? user : null;
        });
    }
    getPurchaseGroupsBoughtByUserID(userID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { purchaseGroupsBought } = yield User.findById(userID);
            return purchaseGroupsBought ? purchaseGroupsBought : null;
        });
    }
    addPurchaseGroupToUser(purchaseGroup, amount, userID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const cost = amount * purchaseGroup.priceForGroup;
            yield User.findByIdAndUpdate(userID, {
                $push: {
                    purchaseGroupsBought: {
                        purchaseGroup: purchaseGroup.id,
                        amount: amount,
                        time: Date.now()
                    }
                },
                $inc: {
                    credits: -cost
                }
            });
        });
    }
    updatePurchaseGroupToUser(purchaseGroupID, price, amount, userID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            //fetch user from DB
            let user = yield this.getUser(userID);
            // fetch purchase group to change from list
            const purchaseGroupToChange = _.find(user.purchaseGroupsBought, obj => {
                return obj.purchaseGroup.toString() === purchaseGroupID;
            });
            //update values
            purchaseGroupToChange.amount += amount;
            const cost = amount * price;
            user.credits -= cost;
            //save record to DB
            yield user.save();
        });
    }
    removePurchaseGroupFromUser(userID, purchaseGroupID, amount, price) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            amount = Number(amount);
            const cost = amount * price;
            yield User.findByIdAndUpdate(userID, {
                $pull: {
                    purchaseGroupsBought: {
                        purchaseGroup: {
                            $in: [purchaseGroupID]
                        }
                    }
                },
                $inc: {
                    credits: cost
                }
            });
        });
    }
    takeSuggestionsPurchaseGroupOwnership(suggestionID, userID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield User.findByIdAndUpdate(userID, {
                $push: {
                    purchaseGroupsSell: suggestionID
                }
            });
        });
    }
}
exports.default = UserManager;
//# sourceMappingURL=userManager.js.map