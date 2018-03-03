import * as mongoose from 'mongoose';
import * as _ from 'lodash';

const User = mongoose.model('users');
const PurchaseGroup = mongoose.model('purchaseGroups');

export default class userManager {

    async getUser(userID: string) {
        const user = await User.findById(userID);
        return user ? user : null;
    }

    async getPurchaseGroupsBoughtByUserID(userID: string) {
        const {purchaseGroupsBought} = await User.findById(userID);
        return purchaseGroupsBought ? purchaseGroupsBought : null;
    }


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

    async updatePurchaseGroupToUser(purchaseGroupID, price: number, amount: number, userID: string) {
        amount = Number(amount);
        //fetch user from DB
        let user = await this.getUser(userID);
        // fetch purchase group to change from list
        const purchaseGroupToChange = _.find(user.purchaseGroupsBought, obj => {
            return obj.purchaseGroup.toString() === purchaseGroupID;
        });
        //update values
        purchaseGroupToChange.amount += amount;
        const cost = amount * price;
        user.credits -= cost;
        //save record to DB
        await user.save();
    }
}