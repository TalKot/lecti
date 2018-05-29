"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const userController_1 = require("../controllers/userController");
const requireLogin = require('../middlewares/requireLogin');
module.exports = app => {
    app.get('/api/seller/:id', (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        let userControllerInstance = userController_1.default.Instance;
        yield userControllerInstance.getSellerById(res, id);
    }));
    app.post('/api/newseller', requireLogin, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { id } = req.user;
        let { body } = req;
        let userControllerInstance = userController_1.default.Instance;
        yield userControllerInstance.alertAdminsNewSellerRequest(res, id, body);
    }));
};
//# sourceMappingURL=userRoutes.js.map