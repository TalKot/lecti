"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose = require("mongoose");
const PurchaseGroup = mongoose.model('purchaseGroups');
const User = mongoose.model('users');
const _ = require('lodash');
const PurchaseGroupSchema = require('../models/PurchaseGroup');
class PurchaseGroupManager {
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    /************************************/
    getAllPurchaseGroups() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const purchaseGroupType = yield PurchaseGroup.find({});
            return purchaseGroupType ? purchaseGroupType : null;
        });
    }
    getSuggestionsPurchaseGroups() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const purchaseGroups = yield PurchaseGroup.find({ isSuggestion: true });
            return purchaseGroups ? purchaseGroups : null;
        });
    }
    getSuggestionsPurchaseGroupByID(ID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const purchaseGroup = yield PurchaseGroup.findById(ID);
            return purchaseGroup ? purchaseGroup : null;
        });
    }
    getPurchaseGroupById(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const purchaseGroup = yield PurchaseGroup.findById(id)
                .populate({
                path: 'seller',
                model: 'users',
                select: ["displayName", "email", "photoURL", "_id"]
            });
            return purchaseGroup ? purchaseGroup : null;
        });
    }
    getPurchaseGroupsByType(type, page, amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let pageNumber = Number(page);
            const maxPurchaseGroup = pageNumber * 12;
            const minPurchaseGroup = maxPurchaseGroup - 12;
            //will be used for custom purchase groups selector
            let purchaseGroup;
            if (amount) {
                purchaseGroup = yield PurchaseGroup.find({ type, isSuggestion: false })
                    .sort({ discount: -1 })
                    .limit(amount);
            }
            else {
                purchaseGroup = yield PurchaseGroup.find({ type, isSuggestion: false })
                    .sort({ discount: -1 })
                    .skip(minPurchaseGroup)
                    .limit(12);
            }
            let count = yield PurchaseGroup.find({ type })
                .count();
            return purchaseGroup ? { count, purchaseGroup } : null;
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
    }
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
            let [{ type }, user] = yield Promise.all([
                PurchaseGroup.findById(purchaseGroupsViewed),
                User.findById(userID)
            ]);
            try {
                if (user.purchaseGroupsViewed.length < 5) {
                    yield User.findByIdAndUpdate(userID, {
                        $push: {
                            purchaseGroupsViewed: type
                        }
                    });
                }
                else {
                    //TODO - NEED TO DEVELOP LIFO STACK
                    user.purchaseGroupsViewed.pop();
                    user.purchaseGroupsViewed.push(type);
                    yield user.save();
                }
            }
            catch (e) {
                throw e;
            }
        });
    }
    updateUserOnPurchaseGroup(purchaseGroupID, price, amount, userID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
            purchaseGroup.potentialBuyers.forEach((userData) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const refund = (userData.amount * purchaseGroup.priceForGroup);
                yield User.findByIdAndUpdate(userData.user, {
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
            yield PurchaseGroup.findByIdAndUpdate(purchaseGroup._id, {
                isDeleted: true,
                isActive: false,
                sales: 0
            });
        });
    }
    searchPurchaseGroup(searchValue) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield PurchaseGroup.find({
                    $text: {
                        $search: searchValue
                    }
                });
                return res;
            }
            catch (e) {
                throw e;
            }
        });
    }
    addTypeToNotRelevantList(userID, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const TIME_INTERVAL = 1000 * 60 * 10; //10 minutes
            yield User.findByIdAndUpdate(userID, {
                $push: {
                    notRelevantTypes: type
                },
                typesAttempts: 0
            });
            setTimeout(this.removeTypeToNotRelevantList, TIME_INTERVAL, userID, type);
        });
    }
    removeTypeToNotRelevantList(userID, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield User.findByIdAndUpdate(userID, {
                $pull: {
                    notRelevantTypes: type
                }
            });
        });
    }
    increaseAttemptsAndCheck(userID, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ATTEMPTS = 4;
            const user = yield User.findById(userID);
            if (user.typesAttempts < ATTEMPTS) {
                user.typesAttempts += 1;
                yield user.save();
            }
            else {
                user.typesAttempts = 0;
                yield Promise.all([
                    user.save(),
                    this.addTypeToNotRelevantList(userID, type)
                ]);
            }
        });
    }
    createPurchaseGroup(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let purchaseGroupObject = new PurchaseGroupSchema(data);
                purchaseGroupObject = yield purchaseGroupObject.save();
                yield User.findByIdAndUpdate(purchaseGroupObject._id, {
                    $push: {
                        purchaseGroupsSell: purchaseGroupObject._id
                    }
                });
                return purchaseGroupObject;
            }
            catch (e) {
                throw e;
            }
        });
    }
    createSuggestionsPurchaseGroup(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let purchaseGroupObject = new PurchaseGroupSchema(data);
                return yield purchaseGroupObject.save();
            }
            catch (e) {
                throw e;
            }
        });
    }
    takeSuggestionsPurchaseGroupOwnership(suggestionID, userID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield PurchaseGroup.findByIdAndUpdate(suggestionID, {
                    isSuggestion: false,
                    seller: userID
                });
            }
            catch (e) {
                throw e;
            }
        });
    }
}
exports.default = PurchaseGroupManager;
//# sourceMappingURL=purchaseGroupManager.js.map