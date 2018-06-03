"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const commentManager_1 = require("../managers/commentManager");
const httpResponse_1 = require("../common/httpResponse");
class CommentController {
    constructor() {
        /************************************/
        this.postComment = (res, rating, seller, comment, userID) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield commentManager_1.default.Instance.postComment(rating, seller, comment, userID);
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
exports.default = CommentController;
//# sourceMappingURL=commentController.js.map