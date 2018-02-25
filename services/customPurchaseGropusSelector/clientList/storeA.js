"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseStore_1 = require("./baseStore");
class storeA extends baseStore_1.default {
    constructor() {
        super(...arguments);
        this.notify = (message) => {
            console.log(`store A! - ${message}`);
        };
    }
}
exports.default = storeA;
//# sourceMappingURL=storeA.js.map