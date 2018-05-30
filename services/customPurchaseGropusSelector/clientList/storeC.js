"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseStore_1 = require("./baseStore");
class storeC extends baseStore_1.default {
    constructor() {
        super(...arguments);
        this.STORE = "store C";
        this.mailingList = ['talkot123@gmail.com', 'lougassi@gmail.com','Lecti99@gmail.com'];
    }
}
exports.default = storeC;
//# sourceMappingURL=storeC.js.map