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
    app.get('/api/purchaseGroup/getsuggestions/', (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let purchaseGroupControllerInstance = new purchaseGroupController_1.default();
        yield purchaseGroupControllerInstance.getSuggestionsPurchaseGroupByType(res);
    }));
    app.get('/api/purchaseGroup/getgroup/user/', requireLogin, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let purchaseGroupControllerInstance = new purchaseGroupController_1.default();
        yield purchaseGroupControllerInstance.getPurchaseGroupsByUserId(res, req.user.id);
    }));
    app.get('/api/purchaseGroup/getsales/user/', requireLogin, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let purchaseGroupControllerInstance = new purchaseGroupController_1.default();
        yield purchaseGroupControllerInstance.getSalesPurchaseGroupsByUserId(res, req.user.id);
    }));
    app.post('/api/purchaseGroup/remove/:ID/', requireLogin, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { amount, price } = req.body;
        const purchaseGroupToRemove = req.params.ID;
        let purchaseGroupControllerInstance = new purchaseGroupController_1.default();
        yield purchaseGroupControllerInstance.removePurchaseGroupsFromUser(res, req.user.id, purchaseGroupToRemove, amount, price);
    }));
    app.post('/api/purchaseGroup/removesale/:ID/', requireLogin, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const purchaseGroupToRemove = req.params.ID;
        let purchaseGroupControllerInstance = new purchaseGroupController_1.default();
        yield purchaseGroupControllerInstance.removeSellPurchaseGroupsFromUser(res, req.user.id, purchaseGroupToRemove);
    }));
    app.post('/api/purchaseGroup/viewed/:ID/', requireLogin, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const purchaseGroupsViewed = req.params.ID;
        let purchaseGroupControllerInstance = new purchaseGroupController_1.default();
        yield purchaseGroupControllerInstance.purchaseGroupsViewed(res, req.user.id, purchaseGroupsViewed);
    }));
    app.post('/api/purchaseGroup/buy/', requireLogin, requireCredits, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let { purchaseGroupID, amount } = req.body;
        let userID = req.user._id.toString();
        let purchaseGroupControllerInstance = new purchaseGroupController_1.default();
        yield purchaseGroupControllerInstance.buyPurchaseGroup(res, purchaseGroupID, amount, userID);
    }));
    app.get('/api/purchaseGroup/search/:name/', (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const searchName = req.params.name;
        let purchaseGroupControllerInstance = new purchaseGroupController_1.default();
        yield purchaseGroupControllerInstance.searchPurchaseGroup(res, searchName);
    }));
    app.get('/api/purchaseGroup/getgroup/custom/', requireLogin, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let purchaseGroupControllerInstance = new purchaseGroupController_1.default();
        yield purchaseGroupControllerInstance.getCustomPurchaseGroupsByUserId(res, req.user.id);
    }));
    app.post('/api/purchaseGroup/types/', requireLogin, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let { type, status } = req.body;
        let purchaseGroupControllerInstance = new purchaseGroupController_1.default();
        yield purchaseGroupControllerInstance.typeOnNotRelevantList(res, req.user.id, type, status);
    }));
    app.post('/api/purchaseGroup/types/increase', requireLogin, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let { type } = req.body;
        let purchaseGroupControllerInstance = new purchaseGroupController_1.default();
        yield purchaseGroupControllerInstance.increaseAttemptsAndCheck(res, req.user.id, type);
    }));
    app.post('/api/create/purchasegroup/', requireLogin, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let data = req.body;
        let purchaseGroupControllerInstance = new purchaseGroupController_1.default();
        yield purchaseGroupControllerInstance.createPurchaseGroup(res, data, req.user.id);
    }));
};
//# sourceMappingURL=purchaseGroupRoutes.js.map