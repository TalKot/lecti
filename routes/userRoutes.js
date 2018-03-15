"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const userController_1 = require("../controllers/userController");
const requireLogin = require('../middlewares/requireLogin');
module.exports = app => {
    app.get('/api/seller/:id', requireLogin, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        let userControllerInstance = new userController_1.default();
        yield userControllerInstance.getSellerById(res, id);
    }));
};
//# sourceMappingURL=userRoutes.js.map