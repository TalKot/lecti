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
const WEEK = 1000 * 60 * 60 * 24 * 7;
class CustomPurchaseGroupsSelector {
    constructor() {
        this.notify = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const clientListSlim = Object.keys(clientNotify);
            clientListSlim.forEach(client => {
                if (this.message.length) {
                    clientNotify[client](this.message);
                }
            });
            //reset algorithm data and recursive call
            this.message = [];
            // setInterval(this.notify, WEEK);
            setInterval(this.notify, 1000 * 20);
        });
        this.message = [];
    }
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    selectCustomPurchaseGroupsTypeForUser(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let selectedType;
            const user = yield User.findById(userId);
            try {
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
                selectedType = Object.keys(purchaseGroupsResults).reduce((typeA, typeB) => {
                    return purchaseGroupsResults[typeA] > purchaseGroupsResults[typeB] ? typeA : typeB;
                });
            }
            catch (e) {
                selectedType = 'computers';
            }
            const res = `${user.displayName}, ${user.email} will need ${selectedType}`;
            this.message.push(res);
            return selectedType;
        });
    }
}
exports.default = CustomPurchaseGroupsSelector;
//# sourceMappingURL=customPurchaseGropusSelector.js.map