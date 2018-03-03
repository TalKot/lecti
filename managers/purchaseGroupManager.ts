import * as mongoose from 'mongoose';

const PurchaseGroup = mongoose.model('purchaseGroups');
const User = mongoose.model('users');
const _ = require('lodash');

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
        //TODO - DO WE NEED THE QUERY BELOW?
        const purchaseGroup = await PurchaseGroup.find({type}
            // ,
            //     {
            //     name: 1,
            //     picture: 1,
            //     priceForGroup: 1,
            //     originalPrice: 1,
            //     totalAmount: 1,
            //     seller: 1,
            //     totalSales: 1,
            //     type: 1,
            //     isActive: 1
            // }
        )
        //
        return purchaseGroup ? purchaseGroup : null;
    }

    //user by profile page
    async getPurchaseGroupsByUserId(userId: string) {
        //finds the user from the DB
        const user = await User.findById(userId);
        //get user purchaseGroups ids
        const ids = user.purchaseGroupsBought.map(purchaseGroup => {
            return purchaseGroup.purchaseGroup.toString();
        });
        // bring purchase groups data from DB
        let purchaseGroupUserOwn = await PurchaseGroup.find({"_id": {"$in": ids}});
        //index by id
        let purchaseGroupIndexed = _.keyBy(purchaseGroupUserOwn, 'id');
        //loop over the id and push
        const fullPurchaseGroupList = user.purchaseGroupsBought.map(({time, purchaseGroup, _id, amount}) => {
            return {
                data: purchaseGroupIndexed[purchaseGroup].toObject(),
                time,
                _id,
                amount
            }
        });
        return fullPurchaseGroupList;
    }


    async addUserToPurchaseGroup(purchaseGroupID: string, amount: number, userID: string) {
        await PurchaseGroup.findByIdAndUpdate(purchaseGroupID, {
            $push: {
                potentialBuyers: {
                    user: userID,
                    amount: amount
                }
            },
            $inc: {
                sales: amount
            }
        });
    }

    //TODO - REMOVE THIS TO USER MANAGER
    async addToCart(purchaseGroupID: string, amount: number, userID: string) {
        await User.findByIdAndUpdate(userID, {
            $push: {
                cart: {
                    purchaseGroup: purchaseGroupID,
                    amount: amount
                }
            }
        });
    }

    async updateUserOnPurchaseGroup(purchaseGroupID, price, amount, userID) {
        amount = Number(amount);

        let purchaseGroup = await this.getPurchaseGroupById(purchaseGroupID);
        const userFromPotentialBuyers = _.find(purchaseGroup.potentialBuyers, obj => {
            return obj.user.toString() === userID;
        });
        purchaseGroup.sales += amount;
        userFromPotentialBuyers.amount += amount;
        userFromPotentialBuyers.time = Date.now();
        await purchaseGroup.save();
    }


    async removeUserFromPurchaseGroup(userID, purchaseGroupID, amount) {
        amount = Number(amount);

        await PurchaseGroup.findByIdAndUpdate(purchaseGroupID, {
            $pull: {
                potentialBuyers: {
                    user:{
                        $in : [userID]
                    }
                }
            },
            $inc:{
                sales : -amount
            }
        });
    }
}