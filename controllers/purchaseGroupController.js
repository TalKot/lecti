"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const purchaseGroupManager_1 = require("../managers/purchaseGroupManager");
const httpResponse_1 = require("../common/httpResponse");
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
}
exports.default = purchaseGroupController;
//# sourceMappingURL=purchaseGroupController.js.map