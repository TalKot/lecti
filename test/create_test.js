const User = require('../models/User');
const Comment = require('../models/Comment');
const PurchaseGroup = require('../models/PurchaseGroup');
const assert = require('assert');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;

describe('Creating records', () => {

    it('saves a user', async () => {
        let leoMessi = new User({name: 'leo Messi'});
        await leoMessi.save();
        assert(!leoMessi.isNew);
        expect(leoMessi.name).to.be.equal('leo Messi')
    });

    it('saves a group', async () => {
        let leoMessiPurchaseGroup = new PurchaseGroup({name: 'some testing group'});
        await leoMessiPurchaseGroup.save();
        assert(!leoMessiPurchaseGroup.isNew);
        expect(leoMessiPurchaseGroup.name).to.be.equal('some testing group')
    });

    it('saves a comment', async () => {
        let leoMessiComment = new Comment({
            author: 'Leo Messi',
            content: 'i am the best in the world!',
            rating: '5'
        });
        await leoMessiComment.save();
        assert(!leoMessiComment.isNew);
        expect(leoMessiComment.content).to.be.equal('i am the best in the world!');
    });

});

