import * as mongoose from 'mongoose';

const PurchaseGroup = mongoose.model('purchaseGroups');
const User = mongoose.model('users');


export default class purchaseGroupManager {

    async getAllPurchaseGroups() {
        const purchaseGroupType = await PurchaseGroup.find({});
        return purchaseGroupType ? purchaseGroupType : null;
    }

    async getPurchaseGroupById(id) {
        const purchaseGroup = await PurchaseGroup.findById(id);
        return purchaseGroup ? purchaseGroup : null;
    }

    async getPurchaseGroupsByType(type) {
        const purchaseGroup = await PurchaseGroup.find({type}, {
            name: 1,
            picture: 1,
            priceForGroup: 1,
            originalPrice: 1,
            totalAmount: 1,
            seller: 1,
            totalSales: 1,
            type: 1
        });
        return purchaseGroup ? purchaseGroup : null;
    }

    async getPurchaseGroupsByUserId(userId) {
        const {cart} = await User.findById(userId);
        return cart ? cart : null;
    }
}