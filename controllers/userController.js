"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const userManager_1 = require("../managers/userManager");
const httpResponse_1 = require("../common/httpResponse");
class userController {
    getUserByID(res, userID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let userManagerInstance = new userManager_1.default();
                let user = yield userManagerInstance.getUser(userID);
                user ? httpResponse_1.default.sendOk(res, user) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
    }
}
exports.default = userController;
//# sourceMappingURL=userController.js.map