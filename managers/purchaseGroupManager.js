"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose = require("mongoose");
const PurchaseGroup = mongoose.model('purchaseGroups');
const User = mongoose.model('users');
const _ = require('lodash');
class purchaseGroupManager {
    getAllPurchaseGroups() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const purchaseGroupType = yield PurchaseGroup.find({});
            return purchaseGroupType ? purchaseGroupType : null;
        });
    }
    getPurchaseGroupById(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const purchaseGroup = yield PurchaseGroup.findById(id);
            return purchaseGroup ? purchaseGroup : null;
        });
    }
    getPurchaseGroupsByType(type, amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let purchaseGroup = yield PurchaseGroup.find({ type })
                .sort({ discount: 1 })
                .limit(amount);
            purchaseGroup = purchaseGroup.map(pb => {
                return pb.toObject();
            });
            return purchaseGroup ? purchaseGroup : null;
        });
    }
    updatePurchaseGroupById(purchaseGroupId, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield PurchaseGroup.findByIdAndUpdate(purchaseGroupId, value);
        });
    }
    //user by profile page
    getPurchaseGroupsByUserId(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            //finds the user from the DB
            const user = yield User.findById(userId);
            //get user purchaseGroups ids
            const ids = user.purchaseGroupsBought.map(purchaseGroup => {
                return purchaseGroup.purchaseGroup.toString();
            });
            // bring purchase groups data from DB
            let purchaseGroupUserOwn = yield PurchaseGroup.find({ "_id": { "$in": ids } });
            //index by id
            let purchaseGroupIndexed = _.keyBy(purchaseGroupUserOwn, 'id');
            //loop over the id and push
            try {
                const fullPurchaseGroupList = user.purchaseGroupsBought.map(({ time, purchaseGroup, _id, amount }) => {
                    return {
                        data: purchaseGroupIndexed[purchaseGroup] ? purchaseGroupIndexed[purchaseGroup].toObject() : undefined,
                        time,
                        _id,
                        amount
                    };
                });
                return fullPurchaseGroupList;
            }
            catch (e) {
                throw e;
            }
        });
    } //user by profile page
    getSalesPurchaseGroupsByUserId(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const { purchaseGroupsSell } = yield User.findById(userId)
                    .populate({
                    path: 'purchaseGroupsSell',
                    model: 'purchaseGroups'
                });
                return purchaseGroupsSell ? purchaseGroupsSell : null;
            }
            catch (e) {
                throw e;
            }
        });
    }
    addUserToPurchaseGroup(purchaseGroupID, amount, userID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // amount = Number(amount);
            yield PurchaseGroup.findByIdAndUpdate(purchaseGroupID, {
                $push: {
                    potentialBuyers: {
                        user: userID,
                        amount: amount
                    }
                },
                $inc: {
                    sales: amount
                }
            });
        });
    }
    purchaseGroupsViewed(userID, purchaseGroupsViewed) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // let purcahseGroupViewed = await PurchaseGroup.findByIdAndUpdate(purchaseGroupsViewed);
            let user = yield User.findById(userID);
            //TODO - HOW DOES IT WORK EXACTLY? should user _.filter ?
            user.purchaseGroupsViewed.push(purchaseGroupsViewed);
            yield user.save();
            // user = await User.findByIdAndUpdate(userID);
            // console.log(user)
        });
    }
    addToCart(purchaseGroupID, amount, userID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield User.findByIdAndUpdate(userID, {
                $push: {
                    cart: {
                        purchaseGroup: purchaseGroupID,
                        amount: amount
                    }
                }
            });
        });
    }
    updateUserOnPurchaseGroup(purchaseGroupID, price, amount, userID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // amount = Number(amount);
            let purchaseGroup = yield this.getPurchaseGroupById(purchaseGroupID);
            const userFromPotentialBuyers = _.find(purchaseGroup.potentialBuyers, obj => {
                return obj.user.toString() === userID;
            });
            purchaseGroup.sales += amount;
            userFromPotentialBuyers.amount += amount;
            userFromPotentialBuyers.time = Date.now();
            yield purchaseGroup.save();
        });
    }
    removeUserFromPurchaseGroup(userID, purchaseGroupID, amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            amount = Number(amount);
            yield PurchaseGroup.findByIdAndUpdate(purchaseGroupID, {
                $pull: {
                    potentialBuyers: {
                        user: {
                            $in: [userID]
                        }
                    }
                },
                $inc: {
                    sales: -amount
                }
            });
        });
    }
    removeSellPurchaseGroupsFromUser(userID, purchaseGroupToRemove) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const purchaseGroup = yield this.getPurchaseGroupById(purchaseGroupToRemove);
            purchaseGroup.toObject().potentialBuyers.forEach((userData) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const refund = (userData.amount * purchaseGroup.priceForGroup);
                yield User.findByIdAndUpdate(userData.user.toString(), {
                    $inc: {
                        credits: refund
                    },
                    $pull: {
                        purchaseGroupsBought: {
                            user: {
                                $in: [purchaseGroupToRemove]
                            }
                        }
                    }
                });
            }));
            yield PurchaseGroup.findByIdAndUpdate(purchaseGroup._id.toString(), {
                isDeleted: true,
                isActive: false
            });
        });
    }
    searchPurchaseGroup(searchValue) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let fetchedPurcahseGroup = yield PurchaseGroup.find({
                $text: {
                    $search: searchValue
                }
            });
            return fetchedPurcahseGroup;
        });
    }
}
exports.default = purchaseGroupManager;
//# sourceMappingURL=purchaseGroupManager.js.map