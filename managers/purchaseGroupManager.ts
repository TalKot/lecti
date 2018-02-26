import * as mongoose from 'mongoose';
import CustomPurchaseGroupSelector from '../services/customPurchaseGropusSelector/customPurchaseGropusSelector';
const PurchaseGroup = mongoose.model('purchaseGroups');
const User = mongoose.model('users');


export default class purchaseGroupManager {

    async getAllPurchaseGroups() {
        const purchaseGroupType = await PurchaseGroup.find({});
        return purchaseGroupType ? purchaseGroupType : null;
    }

    async getPurchaseGroupById(id: string) {
        const purchaseGroup = await PurchaseGroup.findById(id);
        return purchaseGroup ? purchaseGroup : null;
    }

    async getPurchaseGroupsByType(type: string) {
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

    async getPurchaseGroupsByUserId(userId: string) {
        //TODO: USE THIS TO BRING CART DATA
        const user = await User.findById(userId);
        const ids = user.purchaseGroupsBought.map(purchaseGroup => {
            return purchaseGroup.purchaseGroup.toString();
        });
        return await PurchaseGroup.find({"_id": {"$in": ids}});

    }
    //TODO: SHOULD ERESE THIS?
    // async getCustomPurchaseGroupsByUserId(userId: string) {
    //     const customPurchaseGroupSelector =  new CustomPurchaseGroupSelector();
    //     const type = await customPurchaseGroupSelector.selectCustomPurchaseGroupsToUser(userId);
    //
    //     let user = await User.findById(userId);
    //     return user ? user : null;
    // }

    async addUserToPurchaseGroup(purchaseGroupID: string, amount: number, userID: string) {
        await PurchaseGroup.findByIdAndUpdate(purchaseGroupID, {
            $push: {
                'potentialBuyers': {
                    user: userID,
                    amount: amount
                }
            }
        });
    }
}