"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const commentController_1 = require("../controllers/commentController");
const requireLogin = require('../middlewares/requireLogin');
module.exports = app => {
    app.post('/api/comment/add', requireLogin, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let { rating, seller, comment } = req.body;
        let commentControllerInstance = commentController_1.default.Instance;
        yield commentControllerInstance.postComment(res, rating, seller, comment, req.user.id);
    }));
};
//# sourceMappingURL=commentRoutes.js.map