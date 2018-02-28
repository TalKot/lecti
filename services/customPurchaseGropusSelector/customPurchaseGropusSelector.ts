import * as mongoose from 'mongoose';
import * as _ from 'lodash';
const moment = require('moment');
import PurchaseGroupManager from '../../managers/purchaseGroupManager'
const PurchaseGroup = mongoose.model('purchaseGroups');
const User = mongoose.model('users');
const clientNotify = require('./clientList');
import purchaseGroupsTypesValue = require('./purcahseGroupsTypesValueList');

export default class CustomPurchaseGroupsSelector {

    message: string[];

    constructor() {
        this.message = [];
    }

    get customPurchaseGroupsResult(): string[] {
        return this.message;
    }


    public async selectCustomPurchaseGroupsTypeForUser(userId: string) {
        const user = await User.findById(userId);

        const purchaseGroupManager = new PurchaseGroupManager();
        const purchaseGroupsByUser = await purchaseGroupManager.getPurchaseGroupsByUserId(userId);

        let purchaseGroupsResults = {};
        let purchaseGroupsTimes = {};
        let purchaseGroupsPriority = purchaseGroupsTypesValue;

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


        //calculating all data combined
        Object.keys(purchaseGroupsResults).forEach(type => {

            if (purchaseGroupsPriority[type]) {
                purchaseGroupsResults[type] *= purchaseGroupsPriority[type];
            }

            if (purchaseGroupsTimes[type]) {
                purchaseGroupsResults[type] /= purchaseGroupsTimes[type];
            }

        });

        //get result
        const selectedType = Object.keys(purchaseGroupsResults).reduce((typeA, typeB)=>{
            return purchaseGroupsResults[typeA] > purchaseGroupsResults[typeB] ? typeA : typeB;
        });

        this.message.push(`${user.displayName}, ${user.email} will need ${selectedType}`);
        // await this.notify();
        return selectedType;
    }

    public notify = async () => {
        //TODO: implements logic of the mailer
        const clientListSlim = Object.keys(clientNotify);
        clientListSlim.forEach(client => {
            clientNotify[client](this.message);
        });
        this.message = [];
        setInterval(this.notify, 1000 * 5);
    }

}
