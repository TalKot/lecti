"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseStore_1 = require("./baseStore");
const keys_1 = require("../../../config/keys");
class storeA extends baseStore_1.default {
    constructor() {
        super(...arguments);
        this.STORE = "store A";
        this.mailingList = keys_1.groupA;
        // public notify = async (message) => {
        //     console.log(`${this.STORE}! - to the following mailing list ${this.mailingList}`);
        // }
    }
}
exports.default = storeA;
//# sourceMappingURL=storeA.js.map