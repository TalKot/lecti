import * as mongoose from 'mongoose';

const PurchaseGroup = mongoose.model('purchaseGroups');
const User = mongoose.model('users');
const _ = require('lodash');
const PurchaseGroupSchema = require('../models/PurchaseGroup');
const {attempts, timeIntervalRemoveNotRelevent} = require('../config/keys');
const Mailer = require('../services/emailsNotifications/tookOwnershipPurchaseGroupMailer');
const tookOwnershipTemplate = require('../services/emailsNotifications/emailTemplates/tookOwnershipTemplate');

export default class PurchaseGroupManager {
    /****** will be PurchaseGroupManager as singelton*****/
    private static _instance;

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    /************************************/

    getAllPurchaseGroups = async () => {
        return await PurchaseGroup.find({});
    };

    getSuggestionsPurchaseGroups = async () => {
        const purchaseGroups = await PurchaseGroup.find({isSuggestion: true});
        return purchaseGroups ? purchaseGroups : null;
    };

    getAllNewPurchaseGroups = async () => {
        const res = await PurchaseGroup.find({newPurchaseGroup: true});
        return res;
    };

    getSuggestionsPurchaseGroupByID = async ID => {
        const purchaseGroup = await PurchaseGroup.findById(ID);
        return purchaseGroup ? purchaseGroup : null;
    };

    getPurchaseGroupById = async (id: string) => {
        const purchaseGroup = await PurchaseGroup.findById(id)
            .populate({
                path: 'seller',
                model: 'users',
                select: ["displayName", "email", "photoURL", "_id"]
            });
        return purchaseGroup ? purchaseGroup : null;
    };

    getPurchaseGroupsByType = async (subCategory: string, page: string, amount?: number) => {
        let pageNumber = Number(page);

        const maxPurchaseGroup = pageNumber * 12;
        const minPurchaseGroup = maxPurchaseGroup - 12;
        //will be used for custom purchase groups selector
        let purchaseGroup;

        if (amount && !subCategory) {
            purchaseGroup = await PurchaseGroup.find({isSuggestion: false, isActive: true})
                .sort({discount: -1})
                .limit(amount);
            let res = {
                count: amount,
                purchaseGroup
            };
            return res;

        } else if (amount) {
            purchaseGroup = await PurchaseGroup.find({subCategory, isSuggestion: false, isActive: true})
                .sort({discount: -1})
                .limit(amount);
        }
        else if (!subCategory){
            purchaseGroup = await PurchaseGroup.find({isSuggestion: false, isActive: true})
                .sort({discount: -1})
                .limit(4);
        }
        else {
            purchaseGroup = await PurchaseGroup.find({subCategory, isSuggestion: false, isActive: true})
                .sort({discount: -1})
                .skip(minPurchaseGroup)
                .limit(12);
        }
        let count = await PurchaseGroup.find({subCategory, isActive: true})
            .count();
        return purchaseGroup ? {count, purchaseGroup} : null;
    };

    getSubPurchaseGroupsByType = async (type: string, page: string, amount?: number) => {
        let pageNumber = Number(page);

        const maxPurchaseGroup = pageNumber * 12;
        const minPurchaseGroup = maxPurchaseGroup - 12;
        //will be used for custom purchase groups selector
        let purchaseGroup;

        if (amount && !type) {
            purchaseGroup = await PurchaseGroup.find({isSuggestion: false, isActive: true})
                .sort({discount: -1})
                .limit(amount);
            let res = {
                count: amount,
                purchaseGroup
            };
            return res;

        } else if (amount) {
            purchaseGroup = await PurchaseGroup.find({'subCategory': type, isSuggestion: false, isActive: true})
                .sort({discount: -1})
                .limit(amount);
        } else {
            purchaseGroup = await PurchaseGroup.find({'subCategory': type, isSuggestion: false, isActive: true})
                .sort({discount: -1})
                .skip(minPurchaseGroup)
                .limit(12);
        }
        let count = await PurchaseGroup.find({'subCategory': type, isActive: true})
            .count();
        return purchaseGroup ? {count, purchaseGroup} : null;

    };

    updatePurchaseGroupById = async (purchaseGroupId, value) => {
        return await PurchaseGroup.findByIdAndUpdate(purchaseGroupId, value);
    };

    //user by profile page
    getPurchaseGroupsByUserId = async (userId: string) => {
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
    };


    getViewedPurchaseGroupsByUserId = async (userId: string) => {
        try {
            const user = await User.findById(userId);
            return user.toObject().purchaseGroupsViewed;
        } catch (e) {
            throw e;
        }
    };

    getSalesPurchaseGroupsByUserId = async (userId: string) => {
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
    };


    addUserToPurchaseGroup = async (purchaseGroupID: string, amount: number, userID: string) => {
        const {address, email} = await User.findById(userID);

        await PurchaseGroup.findByIdAndUpdate(purchaseGroupID, {
            $push: {
                potentialBuyers: {
                    user: userID,
                    amount,
                    address,
                    email
                }
            },
            $inc: {
                sales: amount
            }
        });
    };

    purchaseGroupsViewed = async (userID, purchaseGroupsViewed) => {


        let [{subCategory}, user] = await Promise.all([
            PurchaseGroup.findById(purchaseGroupsViewed),
            User.findById(userID)
        ]);

        try {
            // is stack is full - remove the last argument
            if (user.purchaseGroupsViewed.length >= 5) {
                await user.purchaseGroupsViewed.pop();
                await user.save();
            }
            await User.findByIdAndUpdate(userID, {
                $push: {
                    purchaseGroupsViewed: {
                        $each: [subCategory],
                        $position: 0
                    }
                }
            });

        } catch (e) {
            throw e;
        }
    };

    updateUserOnPurchaseGroup = async (purchaseGroupID, price, amount, userID) => {

        let purchaseGroup = await this.getPurchaseGroupById(purchaseGroupID);
        const userFromPotentialBuyers = _.find(purchaseGroup.potentialBuyers, obj => {
            return obj.user.toString() === userID;
        });
        purchaseGroup.sales += amount;
        userFromPotentialBuyers.amount += amount;
        userFromPotentialBuyers.time = Date.now();
        await purchaseGroup.save();
    };


    removeUserFromPurchaseGroup = async (userID, purchaseGroupID, amount) => {
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
    };

    removeSellPurchaseGroupsFromUser = async (userID, purchaseGroupToRemove) => {
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

    };

    searchPurchaseGroup = async searchValue => {
        try {
            const res = await PurchaseGroup.find({
                $text: {
                    $search: searchValue
                }
            });
            return res;
        } catch (e) {
            throw e;
        }
    };

    //todo - need to check what to do in here
    getSimilarGroupByName = async (purchaseGroupsSimilarName, userType) => {
        try {

            const res = await PurchaseGroup.findOne({
                // isSuggestion: userType,
                $text: {
                    $search: purchaseGroupsSimilarName
                }
            });

            return res;
        } catch (e) {
            throw e;
        }
    };

    addTypeToNotRelevantList = async (userID, type) => {
        //const TIME_INTERVAL = 1000 * 60 * 10;//10 minutes
        const TIME_INTERVAL = timeIntervalRemoveNotRelevent;

        //if type not in array already - eneter to notRelevent array
        let {notRelevantTypes} = await User.findById(userID);
        if (notRelevantTypes.indexOf(type) === -1) {
            await User.findByIdAndUpdate(userID, {
                $push: {
                    notRelevantTypes: type
                },
                typesAttempts: 0
            });
            setTimeout(this.removeTypeToNotRelevantList, TIME_INTERVAL, userID, type);
        }
    };

    removeTypeToNotRelevantList = async (userID, type) => {
        await User.findByIdAndUpdate(userID, {
            $pull: {
                notRelevantTypes: type
            }
        });
    };


    increaseAttemptsAndCheck = async (userID, type) => {

        const user = await User.findById(userID);
        console.log('sjdhgfjksdagfkjdsahfkdsahfkadshkfhsadfhjasdjfhadskgfdjkshghjkdasgfkjdsagfkjadshk')
        console.log(attempts);
        if (user.typesAttempts < attempts) {

            user.typesAttempts += 1;
            await user.save();

        } else {
            user.typesAttempts = 0;
            await Promise.all([
                user.save(),
                this.addTypeToNotRelevantList(userID, type)
            ])
        }
    };

    createPurchaseGroup = async (data) => {
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
    };

    createSuggestionsPurchaseGroup = async (data) => {
        try {
            let purchaseGroupObject = new PurchaseGroupSchema(data);
            return await purchaseGroupObject.save();
        } catch (e) {
            throw e;
        }
    };

    takeSuggestionsPurchaseGroupOwnership = async (suggestionID, userID) => {
        try {
            //update potential buyers that group is now live and can be bought
            const {potentialBuyers, name} = await PurchaseGroup.findById(suggestionID);
            this.notifyForTakingOwnerForPurchaseGroup(potentialBuyers, name);

            //update suggestion purchase group to become live
            await PurchaseGroup.findByIdAndUpdate(suggestionID, {
                isSuggestion: false,
                seller: userID,
                $set: {
                    potentialBuyers: []
                }
            });

        } catch (e) {
            throw e;
        }
    };

    notifyForTakingOwnerForPurchaseGroup = async (potentialBuyers, name) => {
        const ids = potentialBuyers.map(user => user.user);
        const userToNotifyForPurchaeGroupBecomeLive = await User.find({"_id": {"$in": ids}});
        const emails = userToNotifyForPurchaeGroupBecomeLive.map(user => user.email);


        const options = {
            body: 'log in to your account to start purchasing',
            subject: 'Seller user took ownership on purchase group!',
            title: 'Seller user took ownership on purchase group!',
            mailingList: emails
        };

        const mailer = new Mailer(options, tookOwnershipTemplate(name));
        await mailer.send();
    };

    joinSuggestionGroup = async (groupID, userID) => {
        try {
            let suggestionGroup = await PurchaseGroup.findById(groupID);
            let buyers = suggestionGroup.potentialBuyers;
            buyers = _.keyBy(buyers, 'user');
            if (!buyers[userID]) {
                suggestionGroup.potentialBuyers.push({
                    user: userID,
                    amount: 1,
                    time: Date.now()
                });
                await suggestionGroup.save();
            }
        } catch (e) {
            throw e;
        }
    };

    leaveSuggestionGroup = async (groupID, userID) => {
        try {

            await PurchaseGroup.findByIdAndUpdate(groupID, {
                $pull: {
                    potentialBuyers: {
                        $elemMatch: {
                            user: userID
                        }
                    }
                },
            });

        } catch (e) {
            throw e;
        }
    }
}
