"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const baseStore_1 = require("./baseStore");
const keys_1 = require("../../../config/keys");
class storeC extends baseStore_1.default {
    constructor() {
        super(...arguments);
        this.STORE = "store C";
        this.mailingList = keys_1.groupC.split(',');
        this.notify = (message, purchaseGroupsKeyBySubType) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`${this.STORE}! - to the following mailing list ${this.mailingList}`);
        });
    }
}
exports.default = storeC;
//# sourceMappingURL=storeC.js.map