"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseStore_1 = require("./baseStore");
class storeB extends baseStore_1.default {
    constructor() {
        super(...arguments);
        this.notify = (message) => {
            console.log(`store B! - ${message}`);
        };
    }
}
exports.default = storeB;
//# sourceMappingURL=storeB.js.map