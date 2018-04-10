import * as mongoose from 'mongoose';

const PurchaseGroup = mongoose.model('purchaseGroups');
const User = mongoose.model('users');
const _ = require('lodash');
const PurchaseGroupSchema = require('../models/PurchaseGroup');


export default class PurchaseGroupManager {
    /****** will be user as singelton*****/
    private static _instance;

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }
    /************************************/

    async getAllPurchaseGroups() {
        return await PurchaseGroup.find({});
    }

    async getSuggestionsPurchaseGroups() {
        const purchaseGroups = await PurchaseGroup.find({isSuggestion: true});
        return purchaseGroups ? purchaseGroups : null;
    }

    async getSuggestionsPurchaseGroupByID(ID) {
        const purchaseGroup = await PurchaseGroup.findById(ID);
        return purchaseGroup ? purchaseGroup : null;
    }

    async getPurchaseGroupById(id: string) {
        const purchaseGroup = await PurchaseGroup.findById(id)
            .populate({
                path: 'seller',
                model: 'users',
                select: ["displayName", "email", "photoURL", "_id"]
            });
        return purchaseGroup ? purchaseGroup : null;
    }

    async getPurchaseGroupsByType(type: string, page: string, amount?: number) {
        let pageNumber = Number(page);

        const maxPurchaseGroup = pageNumber * 12;
        const minPurchaseGroup = maxPurchaseGroup - 12;
        //will be used for custom purchase groups selector
        let purchaseGroup;

        if (amount && !type){
            purchaseGroup = await PurchaseGroup.find({ isSuggestion: false})
                .sort({discount: -1})
                .limit(amount);
            let res = {
                count :amount,
                purchaseGroup
            };
            return res;

        } else if (amount) {
            purchaseGroup = await PurchaseGroup.find({type, isSuggestion: false})
                .sort({discount: -1})
                .limit(amount);
        } else {
            purchaseGroup = await PurchaseGroup.find({type, isSuggestion: false})
                .sort({discount: -1})
                .skip(minPurchaseGroup)
                .limit(12);
        }
        let count = await PurchaseGroup.find({type})
            .count();
        return purchaseGroup ? {count, purchaseGroup} : null;

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
        try {
            let res = await PurchaseGroup.find({
                $text: {
                    $search: searchValue
                }
            });
            return res;
        } catch (e) {
            throw e;
        }
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

    async createPurchaseGroup(data) {
        try {
            let purchaseGroupObject = new PurchaseGroupSchema(data);
            purchaseGroupObject = await purchaseGroupObject.save();
            await User.findByIdAndUpdate(purchaseGroupObject._id, {
                $push: {
                    purchaseGroupsSell: purchaseGroupObject._id
                }
            });
            return purchaseGroupObject;
        } catch (e) {
            throw e;
        }
    }

    async createSuggestionsPurchaseGroup(data) {
        try {
            let purchaseGroupObject = new PurchaseGroupSchema(data);
            return await purchaseGroupObject.save();
        } catch (e) {
            throw e;
        }
    }

    async takeSuggestionsPurchaseGroupOwnership(suggestionID, userID) {
        try {
            await PurchaseGroup.findByIdAndUpdate(suggestionID, {
                isSuggestion: false,
                seller: userID
            });
        } catch (e) {
            throw e;
        }
    }
}