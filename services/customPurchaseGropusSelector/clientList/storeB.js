"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseStore_1 = require("./baseStore");
class storeB extends baseStore_1.default {
    constructor() {
        super(...arguments);
        this.STORE = "store B";
        this.notify = (message) => {
            console.log(`${this.STORE}! - ${message}`);
        };
    }
}
exports.default = storeB;
//# sourceMappingURL=storeB.js.map