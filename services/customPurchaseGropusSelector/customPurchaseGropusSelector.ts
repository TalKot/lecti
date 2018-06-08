import * as mongoose from 'mongoose';
const moment = require('moment');
import PurchaseGroupManager from '../../managers/purchaseGroupManager'
const clientNotify = require('./clientList');
const CategoryCalculationWeight = require('../../config/keys');
const User = mongoose.model('users');
const PurchaseGroup = mongoose.model('purchaseGroups');
const prioritySettings = process.env.PRIORITY_SETTINGS;
const WEEK: number = 1000 * 60 * 60 * 24 * 7;

export default class CustomPurchaseGroupsSelector {

    /****** will be user as singelton*****/
    private static _instance;

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    message: string[];

    constructor() {
        this.message = [];
    }

    public async selectCustomPurchaseGroupsTypeForUser(userId: string) {
        let selectedType: string;
        const user = await User.findById(userId);

        try {

            const purchaseGroupManager = new PurchaseGroupManager();
            const purchaseGroupsByUser = await purchaseGroupManager.getPurchaseGroupsByUserId(userId);
            const purchaseViewedGroupsByUser = await purchaseGroupManager.getViewedPurchaseGroupsByUserId(userId);

            let purchaseGroupsResults = {};
            let purchaseGroupsTimes = {};
            let purchaseGroupsViews = {};
            let purchaseGroupsAmount = {};
            let purchaseGroupsPriority={};
            try{
                 purchaseGroupsPriority = JSON.parse(prioritySettings);
            }catch (e) {
                console.log(e);
            }


            // getting amount of each purchase group viewed by current user
            user.purchaseGroupsViewed.forEach(type => {

                if (purchaseGroupsViews[type]) {
                    purchaseGroupsViews[type] += 1;
                } else {
                    purchaseGroupsViews[type] = 1
                }
            });


            // getting amount of each purchase group type
            purchaseGroupsByUser.forEach(purchaseGroup => {

                const {subCategory} = purchaseGroup.data;

                const timeBought = moment(purchaseGroup.time).unix();
                const now = moment().unix();
                const timeDiff = moment.duration(now - timeBought).asSeconds();

                if (purchaseGroupsTimes[subCategory]) {
                    if (purchaseGroupsTimes[subCategory] > timeDiff) {
                        purchaseGroupsTimes[subCategory] = timeDiff;
                    }
                } else {
                    purchaseGroupsTimes[subCategory] = timeDiff;
                }

                if (purchaseGroupsAmount[subCategory]) {
                    const value = purchaseGroupsAmount[subCategory] + 1;
                    purchaseGroupsAmount[subCategory] = value;
                } else {
                    purchaseGroupsAmount[subCategory] = 1
                }
            });

            purchaseViewedGroupsByUser.forEach(type => {
                if (!purchaseGroupsResults[type]) {
                    purchaseGroupsResults[type] = 0;
                }
            });


            Object.keys(purchaseGroupsAmount).forEach(type => {
                if (!purchaseGroupsResults[type]) {
                    purchaseGroupsResults[type] = 0;
                }
            });


            // remove all purchase groups that client marked as not relevant
            user.notRelevantTypes.forEach(typeToRemove => {
                // if(purchaseGroupsResults[typeToRemove]) {
                if (typeof purchaseGroupsResults[typeToRemove] != undefined) {
                    delete purchaseGroupsResults[typeToRemove];
                }
            });

            //calculating all data combined
            Object.keys(purchaseGroupsResults).forEach(type => {

                if (purchaseGroupsAmount[type]) {
                    purchaseGroupsResults[type] += purchaseGroupsAmount[type] * CategoryCalculationWeight.amount;
                }

                if (purchaseGroupsPriority[type]) {
                    purchaseGroupsResults[type] += purchaseGroupsPriority[type] * CategoryCalculationWeight.priority;
                }
                if (purchaseGroupsViews[type]) {
                    purchaseGroupsResults[type] += purchaseGroupsViews[type] * CategoryCalculationWeight.viewed;
                }

                if (purchaseGroupsTimes[type]) {
                    purchaseGroupsResults[type] += ((1 / purchaseGroupsTimes[type]) * CategoryCalculationWeight.time);
                }

            });

            //get result
            if (Object.keys(purchaseGroupsResults).length) {

                selectedType = Object.keys(purchaseGroupsResults).reduce((typeA, typeB) => {
                    return purchaseGroupsResults[typeA] > purchaseGroupsResults[typeB] ? typeA : typeB;
                });

            } else {
                // will return the mix of the most discounted purchase groups for new users.
                selectedType = 'cheapest';
            }

        } catch (e) {
            selectedType = 'cheapest';
        }
        const res = `${user.displayName}, ${user.email} will need ${selectedType}`;
        this.message.push(res);
        return selectedType;
    }


    public notify = async () => {

        //create a list of client groups to notify
        const clientListSlim = Object.keys(clientNotify);
        const purchaseGroupManager = new PurchaseGroupManager();
        const newPurchaseGroups = await purchaseGroupManager.getAllNewPurchaseGroups();

        //setting up new purchase group data by catagory for email
        const purchaseGroupsKeyBySubType = {};

        newPurchaseGroups.forEach(purchaseGroupToKey => {
            if (purchaseGroupsKeyBySubType[purchaseGroupToKey.subCategory]) {
                purchaseGroupsKeyBySubType[purchaseGroupToKey.subCategory].push(purchaseGroupToKey);
            } else {
                purchaseGroupsKeyBySubType[purchaseGroupToKey.subCategory] = [purchaseGroupToKey]
            }
        });

        //notify clients groups
        clientListSlim.forEach(client => {
            if (this.message.length) {
                clientNotify[client](this.message, purchaseGroupsKeyBySubType);
            }
        });
        //update new purchasegroup's new flag to false - next time will not show those groups
        newPurchaseGroups.forEach(purchasegroup => {
            purchaseGroupManager.updatePurchaseGroupById(purchasegroup._id, {newPurchaseGroup: false});
        });
        //reset algorithm data and recursive call
        this.message = [];
        setInterval(this.notify, 1000* 5);
        // setInterval(this.notify, WEEK);
    }

}
