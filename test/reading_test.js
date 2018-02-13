const assert = require('assert');
const User = require('../models/User');
const PurchaseGroup = require('../models/PurchaseGroup');
const SellerComment = require('../models/SellerComment');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;

describe('Reading users out of the database', () => {
    let andresIniesta, leoMessi, jordiAlba, gerardPique;

    beforeEach(async () => {
        andresIniesta = new User({name: 'Andres Iniesta'});
        leoMessi = new User({name: 'Messi'});
        jordiAlba = new User({name: 'Jordi Alba'});
        gerardPique = new User({name: 'Gerard Pique'});

        await Promise.all([andresIniesta.save(), leoMessi.save(), jordiAlba.save(), gerardPique.save()])
    });

    it('finds all users with a name of Messi', async () => {
        let users = await User.find({name: 'Messi'});
        // assert(users[0]._id.toString() === leoMessi._id.toString());
    });

    it('find a user with a particular id', async () => {
        let user = await User.findOne({_id: gerardPique._id});
        assert(user.name === 'Gerard Pique');
    });

    xit('can skip and limit the result set', (done) => {
        User.find({})
            .sort({name: 1})
            .skip(1)
            .limit(2)
            .then((users) => {
                assert(users.length === 2);
                assert(users[0].name === 'Gerard Pique');
                assert(users[1].name === 'Maria');
                done();
            });
    });


    xit('find a purchase group by test search', async () => {
        let first = new PurchaseGroup({name: 'first PurchaseGroup'});
        let second = new PurchaseGroup({name: 'second PurchaseGroup'});
        let third = new PurchaseGroup({name: 'third PurchaseGroup'});
        await Promise.all([first.save(), second.save(), third.save()]);

        let fetchedPurcahseGroup = await PurchaseGroup.find({$text: {$search: 'first'}});
        console.log(fetchedPurcahseGroup);
    });
});
