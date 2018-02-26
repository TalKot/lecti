"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose = require("mongoose");
const PurchaseGroup = mongoose.model('purchaseGroups');
const User = mongoose.model('users');
const clientNotify = require('./clientList');
class CustomPurchaseGroupsSelector {
    constructor() {
        this.notify = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            //TODO: implements logic of the mailer
            const clientListSlim = Object.keys(clientNotify);
            clientListSlim.forEach(client => {
                clientNotify[client](this.message);
            });
            this.message = [];
            setInterval(this.notify, 1000 * 5);
        });
        this.message = [];
    }
    get customPurchaseGroupsResult() {
        return this.message;
    }
    selectCustomPurchaseGroupsToUser(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield User.findById(userId);
            const ids = user.purchaseGroupsBought.map(purchaseGroup => {
                return purchaseGroup.purchaseGroup.toString();
            });
            const purchaseGroupList = yield PurchaseGroup.find({ "_id": { "$in": ids } });
            let PB = {};
            let resultType = 'computers';
            purchaseGroupList.forEach(purchaseGroup => {
                const type = purchaseGroup.type;
                if (!PB[type]) {
                    PB = Object.assign({}, PB, { [type]: 1 });
                }
                else {
                    let value = PB[type] + 1;
                    PB = Object.assign({}, PB, { [type]: value });
                }
            });
            this.message.push(`user - ${userId} will need ${resultType}`);
            // await this.notify();
            return resultType;
        });
    }
}
exports.default = CustomPurchaseGroupsSelector;
//# sourceMappingURL=customPurchaseGropusSelector.js.map