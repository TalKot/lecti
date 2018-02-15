import * as mongoose from 'mongoose';
import purchaseGroupController from '../controllers/purchaseGroupController'

const PurchaseGroup = mongoose.model('purchaseGroups');
const User = mongoose.model('users');

module.exports = app => {

    app.get('/api/purchaseGroup/getAll', async (req, res) => {
        let purchaseGroupControllerInstance = new purchaseGroupController();
        await purchaseGroupControllerInstance.getAllPurchaseGroups(res);
    });
};