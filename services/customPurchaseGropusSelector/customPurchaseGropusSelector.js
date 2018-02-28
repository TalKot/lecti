"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose = require("mongoose");
const moment = require('moment');
const purchaseGroupManager_1 = require("../../managers/purchaseGroupManager");
const PurchaseGroup = mongoose.model('purchaseGroups');
const User = mongoose.model('users');
const clientNotify = require('./clientList');
const purchaseGroupsTypesValue = require("./purcahseGroupsTypesValueList");
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
    selectCustomPurchaseGroupsTypeForUser(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield User.findById(userId);
            const purchaseGroupManager = new purchaseGroupManager_1.default();
            const purchaseGroupsByUser = yield purchaseGroupManager.getPurchaseGroupsByUserId(userId);
            let purchaseGroupsResults = {};
            let purchaseGroupsTimes = {};
            let purchaseGroupsPriority = purchaseGroupsTypesValue;
            // getting amount of each purchase group type
            purchaseGroupsByUser.forEach(purchaseGroup => {
                const type = purchaseGroup.data.type;
                const timeBought = moment(purchaseGroup.time).unix();
                const now = moment().unix();
                const timeDiff = moment.duration(now - timeBought).asSeconds();
                if (purchaseGroupsTimes[type]) {
                    if (purchaseGroupsTimes[type] > timeDiff) {
                        purchaseGroupsTimes[type] = timeDiff;
                    }
                }
                else {
                    purchaseGroupsTimes[type] = timeDiff;
                }
                if (purchaseGroupsResults[type]) {
                    const value = purchaseGroupsResults[type] + 1;
                    purchaseGroupsResults[type] = value;
                }
                else {
                    purchaseGroupsResults[type] = 1;
                }
            });
            //calculating all data combined
            Object.keys(purchaseGroupsResults).forEach(type => {
                if (purchaseGroupsPriority[type]) {
                    purchaseGroupsResults[type] *= purchaseGroupsPriority[type];
                }
                if (purchaseGroupsTimes[type]) {
                    purchaseGroupsResults[type] /= purchaseGroupsTimes[type];
                }
            });
            //get result
            const selectedType = Object.keys(purchaseGroupsResults).reduce((typeA, typeB) => {
                return purchaseGroupsResults[typeA] > purchaseGroupsResults[typeB] ? typeA : typeB;
            });
            this.message.push(`${user.displayName}, ${user.email} will need ${selectedType}`);
            // await this.notify();
            return selectedType;
        });
    }
}
exports.default = CustomPurchaseGroupsSelector;
//# sourceMappingURL=customPurchaseGropusSelector.js.map