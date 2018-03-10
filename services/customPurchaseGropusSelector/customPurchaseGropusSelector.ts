import * as mongoose from 'mongoose';

const moment = require('moment');
import PurchaseGroupManager from '../../managers/purchaseGroupManager'

const PurchaseGroup = mongoose.model('purchaseGroups');
const User = mongoose.model('users');
const clientNotify = require('./clientList');
import purchaseGroupsTypesValue = require('./purcahseGroupsTypesValueList');

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
            // .populate({
            //     path:'purchaseGroupsViewed',
            //     model: 'purchaseGroups'
            // });


        try {

            const purchaseGroupManager = new PurchaseGroupManager();
            const purchaseGroupsByUser = await purchaseGroupManager.getPurchaseGroupsByUserId(userId);

            let purchaseGroupsResults = {};
            let purchaseGroupsTimes = {};
            let purchaseGroupsViews = {};
            let purchaseGroupsPriority = purchaseGroupsTypesValue;

            // getting amount of each purchase group viewed by current user
            user.purchaseGroupsViewed.forEach(type => {

                // const type = purchaseGroupViewed;

                if (purchaseGroupsViews[type]) {
                    // const value = purchaseGroupsViews[type] + 1;
                    purchaseGroupsViews[type] += 1;
                } else {
                    purchaseGroupsViews[type] = 1
                }
            });


            // getting amount of each purchase group type
            purchaseGroupsByUser.forEach(purchaseGroup => {

                const type = purchaseGroup.data.type;

                const timeBought = moment(purchaseGroup.time).unix();
                const now = moment().unix();
                const timeDiff = moment.duration(now - timeBought).asSeconds();

                if (purchaseGroupsTimes[type]) {
                    if (purchaseGroupsTimes[type] > timeDiff) {
                        purchaseGroupsTimes[type] = timeDiff;
                    }
                } else {
                    purchaseGroupsTimes[type] = timeDiff;
                }

                if (purchaseGroupsResults[type]) {
                    const value = purchaseGroupsResults[type] + 1;
                    purchaseGroupsResults[type] = value;
                } else {
                    purchaseGroupsResults[type] = 1
                }
            });

            // remove all purchase groups that client marked as not relevant
            user.notRelevantTypes.forEach(typeToRemove => {
                if(purchaseGroupsResults[typeToRemove]) {
                    delete purchaseGroupsResults[typeToRemove];
                }
            });


            //calculating all data combined
            Object.keys(purchaseGroupsResults).forEach(type => {

                if (purchaseGroupsPriority[type]) {
                    purchaseGroupsResults[type] *= purchaseGroupsPriority[type];
                }
                //TODO - IS THIS CORRECT?
                if (purchaseGroupsViews[type]) {
                    purchaseGroupsResults[type] += purchaseGroupsViews[type];
                }

                if (purchaseGroupsTimes[type]) {
                    purchaseGroupsResults[type] /= purchaseGroupsTimes[type];
                }

            });

            //TODO - what happened when empty object?
            //get result
            selectedType = Object.keys(purchaseGroupsResults).reduce((typeA, typeB) => {
                return purchaseGroupsResults[typeA] > purchaseGroupsResults[typeB] ? typeA : typeB;
            });


        }catch(e){
            selectedType = 'computers';
        }
        const res = `${user.displayName}, ${user.email} will need ${selectedType}`;
        this.message.push(res);

        return selectedType;
    }


    public notify = async () => {

        const clientListSlim = Object.keys(clientNotify);

        clientListSlim.forEach(client => {
            if(this.message.length) {
                clientNotify[client](this.message);
            }
        });

        //reset algorithm data and recursive call
        this.message = [];
        // setInterval(this.notify, WEEK);
        setInterval(this.notify, 1000 * 20);
    }

}
