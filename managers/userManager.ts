import * as mongoose from 'mongoose';
import * as _ from 'lodash';

const User = mongoose.model('users');
const PurchaseGroup = mongoose.model('purchaseGroups');

export default class UserManager {
    /****** will be user as singelton*****/
    private static _instance;

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    /************************************/

    async getUser(userID: string) {
        const user = await User.findById(userID)
            .populate({
                path: 'purchaseGroupsSell',
                model: 'purchaseGroups'
            });

        return user ? user : null;
    }

    async getUserSeller(userID: string) {
        const user = await User.findById(userID, {
            comments: 1,
            displayName: 1,
            email: 1,
            gender: 1,
            photoURL: 1,
            purchaseGroupsSell: 1
        })
            .populate({
                path: 'purchaseGroupsSell',
                model: 'purchaseGroups'
            });

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

    async removePurchaseGroupFromUser(userID, purchaseGroupID, amount, price) {
        amount = Number(amount);
        const cost = amount * price;

        await User.findByIdAndUpdate(userID, {
            $pull: {
                purchaseGroupsBought: {
                    purchaseGroup: {
                        $in: [purchaseGroupID]
                    }
                }
            },
            $inc: {
                credits: cost
            }
        });
    }

    async takeSuggestionsPurchaseGroupOwnership(suggestionID, userID) {

        await User.findByIdAndUpdate(userID, {
            $push: {
                purchaseGroupsSell: suggestionID
            }
        });

    }
}