"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose = require("mongoose");
const PurchaseGroup = mongoose.model('purchaseGroups');
const User = mongoose.model('users');
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
    getPurchaseGroupsByType(type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const purchaseGroup = yield PurchaseGroup.find({ type }, {
                name: 1,
                picture: 1,
                priceForGroup: 1,
                originalPrice: 1,
                totalAmount: 1,
                seller: 1,
                totalSales: 1,
                type: 1
            });
            return purchaseGroup ? purchaseGroup : null;
        });
    }
    getPurchaseGroupsByUserId(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { cart } = yield User.findById(userId);
            return cart ? cart : null;
        });
    }
}
exports.default = purchaseGroupManager;
//# sourceMappingURL=purchaseGroupManager.js.map