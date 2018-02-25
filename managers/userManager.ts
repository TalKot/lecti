import * as mongoose from 'mongoose';

const User = mongoose.model('users');
const PurchaseGroup = mongoose.model('purchaseGroups');

export default class userManager {

    async getUser(userID: string) {
        const user = await User.findById(userID);
        return user ? user : null;
    }


    async addPurchaseGroupToUser(purchaseGroupID: string, amount: number, userID: string) {
        await User.findByIdAndUpdate(userID, {
            $push: {
                'purchaseGroupsBought': {
                    purchaseGroup: purchaseGroupID,
                    amount: amount
                }
            }
        });
        // const user = await User.findById(userID);
        // return user ? user : null;
    }
}