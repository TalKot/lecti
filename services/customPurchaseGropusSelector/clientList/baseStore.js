"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseStore {
    constructor() {
        this.notify = (message) => {
            //TODO: SENDING EMAIL TO CLIENT-STORE
            console.log(`store base ${this.STORE} - ${message}`);
        };
    }
}
exports.default = BaseStore;
//# sourceMappingURL=baseStore.js.map