"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const purchaseGroupController_1 = require("../controllers/purchaseGroupController");
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
module.exports = app => {
    app.get('/api/purchaseGroup/getAll', (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let purchaseGroupControllerInstance = new purchaseGroupController_1.default();
        yield purchaseGroupControllerInstance.getAllPurchaseGroups(res);
    }));
    app.get('/api/purchaseGroup/getgroup/id/:id', (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        let purchaseGroupControllerInstance = new purchaseGroupController_1.default();
        yield purchaseGroupControllerInstance.getPurchaseGroupById(res, id);
    }));
    app.get('/api/purchaseGroup/getgroup/type/:type', (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const type = req.params.type;
        let purchaseGroupControllerInstance = new purchaseGroupController_1.default();
        yield purchaseGroupControllerInstance.getPurchaseGroupByType(res, type);
    }));
    app.get('/api/purchaseGroup/getgroup/user/', requireLogin, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let purchaseGroupControllerInstance = new purchaseGroupController_1.default();
        yield purchaseGroupControllerInstance.getPurchaseGroupsByUserId(res, req.user.id);
    }));
    app.post('/api/purchaseGroup/buy/', requireLogin, requireCredits, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let { purchaseGroupID, amount } = req.body;
        let userID = req.user.toObject()._id.toString();
        let purchaseGroupControllerInstance = new purchaseGroupController_1.default();
        yield purchaseGroupControllerInstance.buyPurchaseGroup(res, purchaseGroupID, amount, userID);
    }));
    app.get('/api/purchaseGroup/getgroup/custom/', requireLogin, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let purchaseGroupControllerInstance = new purchaseGroupController_1.default();
        yield purchaseGroupControllerInstance.getCustomPurchaseGroupsByUserId(res, req.user.id);
    }));
    // app.get('/api/purchaseGroup/getcustomgroups/', requireLogin, async (req, res) => {
    //     TODO: COMPOLETE RELEVENT BACKEND
    //         let purchaseGroupControllerInstance = new purchaseGroupController();
    //     await purchaseGroupControllerInstance.getCustomPurchaseGroupsAlgoResults(res);
    // });
    // // app.post('/purchaseGroup/add', (req, res) => {
    // app.get('/api/purchaseGroup/add', async (req, res) => {
    //
    //     let purchaseGroup = new PurchaseGroup({
    //         name: 'testing PB2',
    //         type: 'computers',
    //         picture: 'sapppp'
    //     });
    //     purchaseGroup = await purchaseGroup.save();
    //     // purchaseGroup = purchaseGroup.toObject();
    //     // let user = req.user.toObject();
    //     req.user.cart.push(purchaseGroup);
    //     await User.findOneAndUpdate({email: req.user.email}, req.user);
    //     res.send(req.user);
    // });
};
//# sourceMappingURL=purchaseGroupRoutes.js.map