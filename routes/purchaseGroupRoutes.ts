const _ = require('lodash');
const Path = require('path-parser');
const URL = require('url');
import * as mongoose from 'mongoose';
import purchaseGroupController from '../controllers/purchaseGroupController'
const requireLogin = require('../middlewares/requireLogin');
// import {purchaseGroupType} from '../services/enums';

const PurchaseGroup = mongoose.model('purchaseGroups');
const User = mongoose.model('users');

module.exports = app => {

    app.get('/api/purchaseGroup/getAll', async (req, res) => {
        let purchaseGroupControllerInstance = new purchaseGroupController();
        await purchaseGroupControllerInstance.getAllPurchaseGroups(res);
    });

    app.get('/api/purchaseGroup/getgroup/id/:id', async (req, res) => {
        const id = req.params.id;
        let purchaseGroupControllerInstance = new purchaseGroupController();
        await purchaseGroupControllerInstance.getPurchaseGroupById(res, id);
    });

    app.get('/api/purchaseGroup/getgroup/type/:type', async (req, res) => {
        const type = req.params.type;
        let purchaseGroupControllerInstance = new purchaseGroupController();
        await purchaseGroupControllerInstance.getPurchaseGroupByType(res, type);
    });

    app.get('/api/purchaseGroup/getgroup/user/', requireLogin, async (req, res) => {
        let purchaseGroupControllerInstance = new purchaseGroupController();
        await purchaseGroupControllerInstance.getPurchaseGroupsByUserId(res, req.user.id);
    });

    app.post('/api/purchaseGroup/buy/', requireLogin, async (req, res) => {
        let {purchaseGroupID,amount} = req.body;
        let userID = req.user.toObject()._id.toString();
        let purchaseGroupControllerInstance = new purchaseGroupController();
        await purchaseGroupControllerInstance.addPurchaseGroupToUser(res, purchaseGroupID, amount, userID);
    });

    // app.post('/purchaseGroup/add', (req, res) => {
    app.get('/api/purchaseGroup/add', async (req, res) => {

        let purchaseGroup = new PurchaseGroup({
            name: 'testing PB2',
            type: 'computers',
            picture: 'sapppp'
        });
        purchaseGroup = await purchaseGroup.save();
        // purchaseGroup = purchaseGroup.toObject();
        // let user = req.user.toObject();
        req.user.cart.push(purchaseGroup);
        await User.findOneAndUpdate({email: req.user.email}, req.user);
        res.send(req.user);
    });
};
