"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose = require("mongoose");
const purchaseGroupController_1 = require("../controllers/purchaseGroupController");
const PurchaseGroup = mongoose.model('purchaseGroups');
const User = mongoose.model('users');
module.exports = app => {
    app.get('/api/purchaseGroup/getAll', (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let purchaseGroupControllerInstance = new purchaseGroupController_1.default();
        yield purchaseGroupControllerInstance.getAllPurchaseGroups(res);
    }));
};
//# sourceMappingURL=purchaseGroupRoutes.js.map