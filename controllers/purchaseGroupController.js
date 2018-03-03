"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const purchaseGroupManager_1 = require("../managers/purchaseGroupManager");
const userManager_1 = require("../managers/userManager");
const httpResponse_1 = require("../common/httpResponse");
const customPurchaseGropusSelector_1 = require("../services/customPurchaseGropusSelector/customPurchaseGropusSelector");
const _ = require("lodash");
class purchaseGroupController {
    getAllPurchaseGroups(res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let purchaseGroupManagerInstance = new purchaseGroupManager_1.default();
                let purchaseGroups = yield purchaseGroupManagerInstance.getAllPurchaseGroups();
                purchaseGroups ? httpResponse_1.default.sendOk(res, purchaseGroups) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
    }
    getPurchaseGroupById(res, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let purchaseGroupManagerInstance = new purchaseGroupManager_1.default();
                let purchaseGroups = yield purchaseGroupManagerInstance.getPurchaseGroupById(id);
                purchaseGroups ? httpResponse_1.default.sendOk(res, purchaseGroups) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
    }
    getPurchaseGroupByType(res, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let purchaseGroupManagerInstance = new purchaseGroupManager_1.default();
                let purchaseGroups = yield purchaseGroupManagerInstance.getPurchaseGroupsByType(type);
                purchaseGroups ? httpResponse_1.default.sendOk(res, purchaseGroups) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
    }
    getPurchaseGroupsByUserId(res, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let purchaseGroupManagerInstance = new purchaseGroupManager_1.default();
                let purchaseGroups = yield purchaseGroupManagerInstance.getPurchaseGroupsByUserId(userId);
                purchaseGroups ? httpResponse_1.default.sendOk(res, purchaseGroups) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
    }
    buyPurchaseGroup(res, purchaseGroupID, amount, userID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let purchaseGroupManagerInstance = new purchaseGroupManager_1.default();
                let userManagerInstance = new userManager_1.default();
                const purchaseGroup = yield purchaseGroupManagerInstance.getPurchaseGroupById(purchaseGroupID);
                // purchase group validation tests
                if (purchaseGroup) {
                    // check that group is active
                    if (!purchaseGroup.isActive) {
                        const error = 'purchaseGroup is not available';
                        httpResponse_1.default.sendError(res, error);
                        throw new Error(error);
                    }
                    //check available amount for client to purchase
                    if (purchaseGroup.totalAmount < amount) {
                        const error = 'Amount is not available for this purchase group';
                        httpResponse_1.default.sendError(res, error);
                        throw new Error(error);
                    }
                    //check available amount left for client to purchase
                    if (purchaseGroup.totalAmount < purchaseGroup.sales + Number(amount)) {
                        const error = 'cannot buy this amount';
                        httpResponse_1.default.sendError(res, error);
                        throw new Error(error);
                    }
                }
                //validate that purchase group is new
                const purchaseGroupsBought = yield userManagerInstance.getPurchaseGroupsBoughtByUserID(userID);
                let userPurchaseGroupBoughtList = _.keyBy(purchaseGroupsBought, obj => obj.purchaseGroup.toString());
                if (userPurchaseGroupBoughtList[purchaseGroupID]) {
                    //purchase group already in this user list
                    // in user - need to update user credits and purchaseGroupsBought amount
                    // in purchase group - need to update sales and potentialBuyers
                    yield Promise.all([
                        userManagerInstance.updatePurchaseGroupToUser(purchaseGroupID, purchaseGroup.priceForGroup, amount, userID),
                        purchaseGroupManagerInstance.updateUserOnPurchaseGroup(purchaseGroupID, purchaseGroup.priceForGroup, amount, userID)
                    ]);
                }
                else {
                    //new purchase group for this user
                    // update records values
                    yield Promise.all([
                        purchaseGroupManagerInstance.addUserToPurchaseGroup(purchaseGroup.id, amount, userID),
                        userManagerInstance.addPurchaseGroupToUser(purchaseGroup, amount, userID)
                    ]);
                }
                //return values
                yield this.getPurchaseGroupByType(res, purchaseGroup.type);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
    }
    getCustomPurchaseGroupsByUserId(res, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const customPurchaseGroupSelector = customPurchaseGropusSelector_1.default.Instance;
                const type = yield customPurchaseGroupSelector.selectCustomPurchaseGroupsTypeForUser(userId);
                const purchaseGroupManagerInstance = new purchaseGroupManager_1.default();
                let purchaseGroups = yield purchaseGroupManagerInstance.getPurchaseGroupsByType(type);
                purchaseGroups ? httpResponse_1.default.sendOk(res, purchaseGroups) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
    }
    removePurchaseGroupsFromUser(res, userID, purchaseGroupToRemove, amount, price) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let purchaseGroupManagerInstance = new purchaseGroupManager_1.default();
                let userManagerInstance = new userManager_1.default();
                // in user - update credits & purchaseGroupsBought
                // in purchase group - sales & potentialBuyers
                yield Promise.all([
                    purchaseGroupManagerInstance.removeUserFromPurchaseGroup(userID, purchaseGroupToRemove, amount),
                    userManagerInstance.removePurchaseGroupFromUser(userID, purchaseGroupToRemove, amount, price)
                ]);
                return yield this.getPurchaseGroupsByUserId(res, userID);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
    }
}
exports.default = purchaseGroupController;
//# sourceMappingURL=purchaseGroupController.js.map