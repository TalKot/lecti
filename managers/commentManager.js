"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose = require("mongoose");
const User = mongoose.model('users');
const Comments = mongoose.model('comments');
const commentSchema = require('../models/Comment');
class CommentManager {
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    /************************************/
    postComment(rating, seller, comment, userID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let commentObject = new commentSchema({ rating, comment, seller, user: userID });
            commentObject = yield commentObject.save();
            let user = yield User.findById(userID);
            user.comments.push(commentObject);
            yield user.save();
        });
    }
}
exports.default = CommentManager;
//# sourceMappingURL=commentManager.js.map