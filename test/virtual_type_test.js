const assert = require('assert');
const User = require('../models/User');
const PurchaseGroup = require('../models/PurchaseGroup');

describe('Virtual types', () => {

    it('check virtual total sales count', async () => {
        const PurchaseGroupInst = new PurchaseGroup({
            name: 'testing',
            salesDay: [1, 2],
            salesWeek: [3, 4],
            salesMonth: [5, 6]
        });
        const leoMessi = new User({
            name: 'leo123',
            purchaseGroups: [PurchaseGroupInst]
        });


        await leoMessi.save();
        await PurchaseGroupInst.save();

        let user = await User.findById({_id: leoMessi.id})
            .populate({
                path: 'purchaseGroups'
            });
        assert(user.purchaseGroupsCount === 1);
        assert(user.purchaseGroups[0].totalSales === 21);
    });


    it('likes returns number', async () => {
        const PurchaseGroupInst = new PurchaseGroup({
            name: 'this is the first purchasGropu of leoMessi'
        });
        const leoMessi = new User({
            name: 'leo',
            purchaseGroups: [PurchaseGroupInst]
        });

        await leoMessi.save();
        let user = await User.findOne({name: 'leo'});
        assert(user.purchaseGroupsCount === 1);
    });


    it('likes returns number', async () => {
        const PurchaseGroup1 = new PurchaseGroup({
            name: 'this is the first purchasGropu of leoMessi'
        });

        const PurchaseGroup2 = new PurchaseGroup({
            name: 'this is the second purchasGropu of leoMessi'
        });

        const PurchaseGroup3 = new PurchaseGroup({
            name: 'this is the 3rd purchasGropu of leoMessi'
        });

        const leoMessi = new User({
            name: 'leoMessi',
            purchaseGroups: [
                PurchaseGroup1,
                PurchaseGroup2,
                PurchaseGroup3
            ]
        });

        await leoMessi.save();
        let user = await User.findOne({name: 'leoMessi'});
        assert(user.purchaseGroupsCount === 3);
    });
});
