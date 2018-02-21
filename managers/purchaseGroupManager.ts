import * as mongoose from 'mongoose';

const PurchaseGroup = mongoose.model('purchaseGroups');
const User = mongoose.model('users');
const PurchaseGroups = mongoose.model('purchaseGroups');


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

    async addPurchaseGroupToUser(purchaseGroupID, amount, userID) {
        //TODO : ARE THESE THE ACTIONS SHOULD BE TAKEN?
        await PurchaseGroups.findByIdAndUpdate(purchaseGroupID, {
            $push: {
                'potentialBuyers': {
                    user: userID,
                    amount: amount
                }
            }
        });
        //TODO: WHAT SHOULD RETURNED?
        const user = await User.findById(userID);
        return user ? user : null;

    }
}