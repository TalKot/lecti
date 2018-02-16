"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = require('lodash');
const Path = require('path-parser');
const URL = require('url');
const mongoose = require("mongoose");
const purchaseGroupController_1 = require("../controllers/purchaseGroupController");
// const requireLogin = require('../middlewares/requireLogin');
// import {purchaseGroupType} from '../services/enums';
const PurchaseGroup = mongoose.model('purchaseGroups');
const User = mongoose.model('users');
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
    app.get('/api/purchaseGroup/getgroup/user/', (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let purchaseGroupControllerInstance = new purchaseGroupController_1.default();
        yield purchaseGroupControllerInstance.getPurchaseGroupsByUserId(res, req.user.id);
    }));
    // app.post('/purchaseGroup/add', (req, res) => {
    app.get('/api/purchaseGroup/add', (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let purchaseGroup = new PurchaseGroup({
            name: 'testing PB2',
            type: 'computers',
            picture: 'sapppp'
        });
        purchaseGroup = yield purchaseGroup.save();
        // purchaseGroup = purchaseGroup.toObject();
        // let user = req.user.toObject();
        req.user.cart.push(purchaseGroup);
        yield User.findOneAndUpdate({ email: req.user.email }, req.user);
        res.send(req.user);
    }));
};
//# sourceMappingURL=purchaseGroupRoutes.js.map