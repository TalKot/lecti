import * as mongoose from 'mongoose';
const User = mongoose.model('users');
const PurchaseGroup = mongoose.model('purchaseGroups');

export default class userManager {

    async getUser(userID: string) {
        const user = await User.findById(userID);
        return user ? user : null;
    }

    //TODO: SHOULD ADD INTERFACE OF PURCHASEGROUP
    async addPurchaseGroupToUser(purchaseGroup, amount: number, userID: string) {

        const cost = amount * purchaseGroup.priceForGroup;

        await User.findByIdAndUpdate(userID, {
            $push: {
                purchaseGroupsBought: {
                    purchaseGroup: purchaseGroup.id,
                    amount: amount,
                    time: Date.now()
                }
            },
            $inc: {
                credits: -cost
            }
        });
    }
}