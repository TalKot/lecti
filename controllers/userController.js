"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const userManager_1 = require("../managers/userManager");
const httpResponse_1 = require("../common/httpResponse");
class UserController {
    constructor() {
        /************************************/
        this.getUserByID = (res, userID) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let userManagerInstance = userManager_1.default.Instance;
                let user = yield userManagerInstance.getUser(userID);
                user ? httpResponse_1.default.sendOk(res, user) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
        this.getSellerById = (res, userID) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let userManagerInstance = userManager_1.default.Instance;
                let userSeller = yield userManagerInstance.getUserSeller(userID);
                userSeller ? httpResponse_1.default.sendOk(res, userSeller) : httpResponse_1.default.sendError(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
        this.alertAdminsNewSellerRequest = (res, userID, body) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let userManagerInstance = userManager_1.default.Instance;
                yield userManagerInstance.alertAdminsNewSellerRequest(userID, body);
                httpResponse_1.default.sendOk(res);
            }
            catch (e) {
                httpResponse_1.default.sendError(res, e);
            }
        });
    }
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = UserController;
//# sourceMappingURL=userController.js.map