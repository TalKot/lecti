"use strict";
const storeA_1 = require("./clientList/storeA");
const storeB_1 = require("./clientList/storeB");
const storeC_1 = require("./clientList/storeC");
module.exports = {
    storeA: (message) => {
        let a = new storeA_1.default();
        a.notify(message);
    },
    storeB: (message) => {
        let a = new storeB_1.default();
        a.notify(message);
    },
    storeC: (message) => {
        let a = new storeC_1.default();
        a.notify(message);
    }
};
//# sourceMappingURL=clientList.js.map