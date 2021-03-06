const assert = require('assert');
const User = require('../models/User');
const PurchaseGroup = require('../models/PurchaseGroup');

describe('Subdocuments', () => {

    it('can create a subdocument', async () => {
        let leoMessiPurchaseGroup = new PurchaseGroup({name: 'some testing purchase group'});

        const leoMessi = new User({
            name: 'Leo Messi',
            purchaseGroups: [leoMessiPurchaseGroup]
        });

        await leoMessiPurchaseGroup.save();
        await leoMessi.save();

        let user = await User.findById({_id: leoMessi.id})
            .populate({
                path: 'purchaseGroups'
            });

        assert(user.purchaseGroups[0].name === 'some testing purchase group');
    });

    it('subdocuments can added to a record from DB', async () => {
        //create objects
        const leoMessi = new User({name: 'Jon the man',});
        let leoMessiPurchaseGroup = new PurchaseGroup({name: 'some testing purchase group'});
        //save to DB
        await leoMessiPurchaseGroup.save();
        await leoMessi.save();
        //fetch user from DB
        let user = await User.findById({_id: leoMessi.id});
        //change data on instance from DB
        user.purchaseGroupsBought.push(leoMessiPurchaseGroup);
        //save instance again
        await user.save();
        //fetch user once again
        user = await User.findById({_id: leoMessi.id})
            .populate({
                path: 'purchaseGroups'
            });
        //asserts
        // console.log(user.purchaseGroupsBought[0].name);
        // console.log(leoMessiPurchaseGroup.name);

        assert(user.purchaseGroupsBought[0].name === leoMessiPurchaseGroup.name);
    });

});
