"use strict";
const storeA_1 = require("./clientList/storeA");
const storeB_1 = require("./clientList/storeB");
const storeC_1 = require("./clientList/storeC");
module.exports = {
    storeA: (message, purchaseGroupsKeyBySubType) => {
        let a = new storeA_1.default();
        a.notify(message, purchaseGroupsKeyBySubType);
    },
    storeB: (message, purchaseGroupsKeyBySubType) => {
        let a = new storeB_1.default();
        a.notify(message, purchaseGroupsKeyBySubType);
    },
    storeC: (message, purchaseGroupsKeyBySubType) => {
        let a = new storeC_1.default();
        a.notify(message, purchaseGroupsKeyBySubType);
    }
};
//# sourceMappingURL=clientList.js.map