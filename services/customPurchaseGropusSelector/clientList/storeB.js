"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const baseStore_1 = require("./baseStore");
class storeB extends baseStore_1.default {
    constructor() {
        super(...arguments);
        this.STORE = "store B";
        this.mailingList = ['talkot123@gmail.com', 'lougassi@gmail.com'];
        this.notify = (message) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(`${this.STORE}! - to the following mailing list ${this.mailingList}`);
        });
    }
}
exports.default = storeB;
//# sourceMappingURL=storeB.js.map