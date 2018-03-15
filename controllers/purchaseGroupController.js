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
    getSuggestionsPurchaseGroupByType(res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let purchaseGroupManagerInstance = new purchaseGroupManager_1.default();
                let purchaseGroups = yield purchaseGroupManagerInstance.getSuggestionsPurchaseGroupByType();
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
    getSalesPurchaseGroupsByUserId(res, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let purchaseGroupManagerInstance = new purchaseGroupManager_1.default();
                let purchaseGroups = yield purchaseGroupManagerInstance.getSalesPurchaseGroupsByUserId(userId);
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
                amount = Number(amount);
                let purchaseGroupShouldClose = false;
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
                    if (purchaseGroup.totalAmount < purchaseGroup.sales + amount) {
                        const error = 'cannot buy this amount';
                        httpResponse_1.default.sendError(res, error);
                        throw new Error(error);
                    }
                    //check if purchase group should close after the udpate
                    if (purchaseGroup.totalAmount === purchaseGroup.sales + amount) {
                        purchaseGroupShouldClose = true;
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
                    // await Promise.all([
                    yield purchaseGroupManagerInstance.addUserToPurchaseGroup(purchaseGroup.id, amount, userID),
                        yield userManagerInstance.addPurchaseGroupToUser(purchaseGroup, amount, userID);
                    // ]);
                }
                // check and update purchase group active status if needed
                if (purchaseGroupShouldClose) {
                    yield purchaseGroupManagerInstance.updatePurchaseGroupById(purchaseGroup.id, { isActive: false });
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
                const RETURN_ARRAY_AMOUNT = 3;
                const purchaseGroupManagerInstance = new purchaseGroupManager_1.default();
                let purchaseGroups = yield purchaseGroupManagerInstance.getPurchaseGroupsByType(type, RETURN_ARRAY_AMOUNT);
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
    removeSellPurchaseGroupsFromUser(res, userID, purchaseGroupToRemove) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let purchaseGroupManagerInstance = new purchaseGroupManager_1.default();
                yield purchaseGroupManagerInstance.removeSellPurchaseGroupsFromUser(userID, purchaseGroupToRemove);
                //TODO - THIS SHOULD BE RETURNED?
                return yield this.getPurchaseGroupsByUserId(res, userID);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
    }
    purchaseGroupsViewed(res, userID, purchaseGroupsViewed) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let purchaseGroupManagerInstance = new purchaseGroupManager_1.default();
                yield purchaseGroupManagerInstance.purchaseGroupsViewed(userID, purchaseGroupsViewed);
                return;
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
    }
    searchPurchaseGroup(res, searchValue) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let purchaseGroupManagerInstance = new purchaseGroupManager_1.default();
                let purchaseGroups = yield purchaseGroupManagerInstance.searchPurchaseGroup(searchValue);
                purchaseGroups ? httpResponse_1.default.sendOk(res, purchaseGroups) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
    }
    typeOnNotRelevantList(res, userID, type, status) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let purchaseGroupManagerInstance = new purchaseGroupManager_1.default();
                if (status) {
                    //add purchase group type to not relevant list
                    yield purchaseGroupManagerInstance.addTypeToNotRelevantList(userID, type);
                }
                else {
                    //remove purchase group type to not relevant list
                    yield purchaseGroupManagerInstance.removeTypeToNotRelevantList(userID, type);
                }
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
    }
    increaseAttemptsAndCheck(res, userID, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let purchaseGroupManagerInstance = new purchaseGroupManager_1.default();
                yield purchaseGroupManagerInstance.increaseAttemptsAndCheck(userID, type);
                httpResponse_1.default.sendOk(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
    }
    createPurchaseGroup(res, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let purchaseGroupManagerInstance = new purchaseGroupManager_1.default();
                let purchaseGroup = yield purchaseGroupManagerInstance.createPurchaseGroup(data);
                purchaseGroup ? httpResponse_1.default.sendOk(res, purchaseGroup) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
    }
}
exports.default = purchaseGroupController;
//# sourceMappingURL=purchaseGroupController.js.map