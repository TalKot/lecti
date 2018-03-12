import * as mongoose from 'mongoose';

const PurchaseGroup = mongoose.model('purchaseGroups');
const User = mongoose.model('users');
const _ = require('lodash');

export default class purchaseGroupManager {

    async getAllPurchaseGroups() {
        const purchaseGroupType = await PurchaseGroup.find({});
        return purchaseGroupType ? purchaseGroupType : null;
    }

    async getSuggestionsPurchaseGroupByType() {
        const purchaseGroupType = await PurchaseGroup.find({isSuggestion: true});
        return purchaseGroupType ? purchaseGroupType : null;
    }

    async getPurchaseGroupById(id: string) {
        const purchaseGroup = await PurchaseGroup.findById(id)
            .populate({
                path:'seller',
                model: 'users',
                select: ["displayName","email","photoURL","_id"]
            });
        return purchaseGroup ? purchaseGroup : null;
    }

    async getPurchaseGroupsByType(type: string, amount?: number) {

        let purchaseGroup = await PurchaseGroup.find({
            type,
            isSuggestion: false
        })
            .sort({
                discount: 1
            })
            .limit(amount);

        return purchaseGroup ? purchaseGroup : null;

    }

    async updatePurchaseGroupById(purchaseGroupId, value) {
        return await PurchaseGroup.findByIdAndUpdate(purchaseGroupId, value);
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
        try {
            const fullPurchaseGroupList = user.purchaseGroupsBought.map(({time, purchaseGroup, _id, amount}) => {
                return {
                    data: purchaseGroupIndexed[purchaseGroup] ? purchaseGroupIndexed[purchaseGroup].toObject() : undefined,
                    time,
                    _id,
                    amount
                }
            });
            return fullPurchaseGroupList;

        } catch (e) {
            throw e;
        }
    }


    async getSalesPurchaseGroupsByUserId(userId: string) {
        try {
            const {purchaseGroupsSell} = await User.findById(userId)
                .populate({
                    path: 'purchaseGroupsSell',
                    model: 'purchaseGroups'
                });

            return purchaseGroupsSell ? purchaseGroupsSell : null;
        } catch (e) {
            throw e;
        }
    }


    async addUserToPurchaseGroup(purchaseGroupID: string, amount: number, userID: string) {
        // amount = Number(amount);
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

    async purchaseGroupsViewed(userID, purchaseGroupsViewed) {

        let [{type}, user] = await Promise.all([
            PurchaseGroup.findById(purchaseGroupsViewed),
            User.findById(userID)
        ]);

        try {
            if (user.purchaseGroupsViewed.length < 5) {
                await User.findByIdAndUpdate(userID, {
                    $push: {
                        purchaseGroupsViewed: type
                    }
                });

            } else {
                //TODO - NEED TO DEVELOP LIFO STACK
                user.purchaseGroupsViewed.pop();
                user.purchaseGroupsViewed.push(type);
                await user.save();
            }
        } catch (e) {
            throw e;
        }
    }

    async addToCart(purchaseGroupID: string, amount: number, userID: string) {
        await User.findByIdAndUpdate(userID, {
            $push: {
                cart: {
                    purchaseGroup: purchaseGroupID,
                    amount
                }
            }
        });
    }

    async updateUserOnPurchaseGroup(purchaseGroupID, price, amount, userID) {

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
                    user: {
                        $in: [userID]
                    }
                }
            },
            $inc: {
                sales: -amount
            }
        });
    }

    async removeSellPurchaseGroupsFromUser(userID, purchaseGroupToRemove) {
        const purchaseGroup = await this.getPurchaseGroupById(purchaseGroupToRemove);

        purchaseGroup.potentialBuyers.forEach(async userData => {

            const refund = (userData.amount * purchaseGroup.priceForGroup);

            await User.findByIdAndUpdate(userData.user, {
                $inc: {
                    credits: refund
                },
                $pull: {
                    purchaseGroupsBought: {
                        user: {
                            $in: [purchaseGroupToRemove]
                        }
                    }
                }
            })

        });


        await PurchaseGroup.findByIdAndUpdate(purchaseGroup._id, {
            isDeleted: true,
            isActive: false,
            sales: 0
        });

    }

    async searchPurchaseGroup(searchValue) {
        return await PurchaseGroup.find({
            $text: {
                $search: searchValue
            }
        });
    }

    async addTypeToNotRelevantList(userID, type) {
        const TIME_INTERVAL = 1000 * 60 * 10;//10 minutes

        await User.findByIdAndUpdate(userID, {
            $push: {
                notRelevantTypes: type
            },
            typesAttempts: 0
        });

        setTimeout(this.removeTypeToNotRelevantList, TIME_INTERVAL, userID, type);


    }

    async removeTypeToNotRelevantList(userID, type) {
        await User.findByIdAndUpdate(userID, {
            $pull: {
                notRelevantTypes: type
            }
        });
    }


    async increaseAttemptsAndCheck(userID, type) {

        const ATTEMPTS = 4;

        const user = await User.findById(userID);

        if (user.typesAttempts < ATTEMPTS) {

            user.typesAttempts += 1;
            await user.save();

        } else {
            user.typesAttempts = 0;
            await Promise.all([
                user.save(),
                this.addTypeToNotRelevantList(userID, type)
            ])
        }
    }
}