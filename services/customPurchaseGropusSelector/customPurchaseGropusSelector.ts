import * as mongoose from 'mongoose';
import * as Q from 'bluebird';

const PurchaseGroup = mongoose.model('purchaseGroups');
const User = mongoose.model('users');
const clientNotify = require('./clientList');

export default class CustomPurchaseGroupsSelector {

    message: string[];

    constructor() {
        this.message = [];
    }

    get customPurchaseGroupsResult(): string[] {
        return this.message;
    }


    public async selectCustomPurchaseGroupsToUser(userId: string) {
        const user = await User.findById(userId);

        const ids = user.purchaseGroupsBought.map(purchaseGroup => {
            return purchaseGroup.purchaseGroup.toString();
        });
        const purchaseGroupList = await PurchaseGroup.find({"_id": {"$in": ids}});

        let PB = {};
        let resultType = 'computers';

        purchaseGroupList.forEach(purchaseGroup => {
            const type = purchaseGroup.type;
            if (!PB[type]) {
                PB = {
                    ...PB,
                    [type]: 1
                }
            } else {
                let value = PB[type] + 1;
                PB = {
                    ...PB,
                    [type]: value
                }
            }
        });

        this.message.push(`user - ${userId} will need ${resultType}`);
        // await this.notify();
        return resultType;
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
