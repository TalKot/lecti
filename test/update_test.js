const assert = require('assert');
const User = require('../models/User');
const PurchaseGroup = require('../models/PurchaseGroup');

describe('Updating records from DB', () => {
    let andresIniesta;

    beforeEach(async () => {
        andresIniesta = new User({name: 'Andres Iniesta'});
        await andresIniesta.save();
    });

    it('A model instance can update', async () => {
        await andresIniesta.update({name: 'Beloti'});
        let user = await User.find({name: 'Beloti'});
        assert(user[0].name === 'Beloti');
    });

    it('A model class can update', async () => {
        await User.update({name: 'Andres Iniesta'}, {name: 'Xavi'});
        let users = await User.find({name: 'Xavi'});
        assert(users[0].name === 'Xavi');
    });

    it('A model class can update one record', async () => {
        await User.findOneAndUpdate({_id: andresIniesta._id}, {name: 'Deolfou'});
        let users = await User.findById({_id: andresIniesta._id});
        assert(users.name === 'Deolfou');

    });

    it('A model class can find a record with an Id and update', async () => {
        await User.findByIdAndUpdate(andresIniesta._id, {name: 'Leo Messi'});
        let users = await User.findById({_id: andresIniesta._id});
        assert(users.name === 'Leo Messi');
    });

    it('A user can have their postcount incremented by 1', async () => {
        await User.update({name: 'Andres Iniesta'}, {$inc: {likes: 10}});
        let user = await User.findOne({name: 'Andres Iniesta'});
        assert(user.likes === 10);
    });

    it('update multi purchase groups at the same time', async () => {
        let first = new PurchaseGroup({name: 'first PurchaseGroup'});
        let second = new PurchaseGroup({name: 'second PurchaseGroup'});
        let third = new PurchaseGroup({name: 'third PurchaseGroup'});
        await Promise.all([first.save(), second.save(), third.save()]);

        const ids = [first._id, second._id, third._id];
        await PurchaseGroup.update(
            {_id: {$in: ids}},
            {name: 'all the same'},
            {multi: true}
        );
        let fetchedPurcahseGroup = await PurchaseGroup.find({});
        console.log(fetchedPurcahseGroup);
    });
});
