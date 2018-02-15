import * as mongoose from 'mongoose';
const PurchaseGroup = mongoose.model('purchaseGroups');
const User = mongoose.model('users');

export default class purchaseGroupManager {


    async getAllPurchaseGroups() {
        const purchaseGroupType = await PurchaseGroup.find({});
        return purchaseGroupType ? purchaseGroupType : null;
    }

}