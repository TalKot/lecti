"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const purchaseGroupManager_1 = require("../managers/purchaseGroupManager");
const userManager_1 = require("../managers/userManager");
const httpResponse_1 = require("../common/httpResponse");
const customPurchaseGropusSelector_1 = require("../services/customPurchaseGropusSelector/customPurchaseGropusSelector");
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
                //check available amount for client to purchase
                const purchaseGroups = yield purchaseGroupManagerInstance.getPurchaseGroupById(purchaseGroupID);
                if (purchaseGroups) {
                    if (purchaseGroups.totalAmount < amount) {
                        const error = 'Amount is not available for this purchase group';
                        httpResponse_1.default.sendError(res, error);
                    }
                }
                // update records values
                yield Promise.all([
                    purchaseGroupManagerInstance.addUserToPurchaseGroup(purchaseGroups.id, amount, userID),
                    userManagerInstance.addPurchaseGroupToUser(purchaseGroups, amount, userID)
                ]);
                //return updated user data
                let user = yield userManagerInstance.getUser(userID);
                user ? httpResponse_1.default.sendOk(res, user) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
    }
    getCustomPurchaseGroupsByUserId(res, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const customPurchaseGroupSelector = new customPurchaseGropusSelector_1.default();
                const type = yield customPurchaseGroupSelector.selectCustomPurchaseGroupsToUser(userId);
                const purchaseGroupManagerInstance = new purchaseGroupManager_1.default();
                let purchaseGroups = yield purchaseGroupManagerInstance.getPurchaseGroupsByType(type);
                purchaseGroups ? httpResponse_1.default.sendOk(res, purchaseGroups) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
    }
}
exports.default = purchaseGroupController;
//# sourceMappingURL=purchaseGroupController.js.map