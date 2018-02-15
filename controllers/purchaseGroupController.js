"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const purchaseGroupManager_1 = require("../managers/purchaseGroupManager");
class purchaseGroupController {
    getAllPurchaseGroups(res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let purchaseGroupManagerInstance = new purchaseGroupManager_1.default();
                let purchaseGroups = yield purchaseGroupManagerInstance.getAllPurchaseGroups();
                purchaseGroups ? this.sendOk(res, purchaseGroups) : this.sendError(res);
            }
            catch (e) {
                this.sendError(res, e);
            }
        });
    }
    sendOk(res, data) {
        res.status(200).json(data);
    }
    sendError(res, error, code) {
        res.status(500).json({
            status: 500,
            statusText: "Internal Server Error",
            error: error ? error.toString() : "",
            code: code
        });
    }
}
exports.default = purchaseGroupController;
//# sourceMappingURL=purchaseGroupController.js.map