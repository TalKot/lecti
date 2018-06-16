const User = require('../models/User');
const Comment = require('../models/Comment');
const PurchaseGroup = require('../models/PurchaseGroup');
const assert = require('assert');

describe('Assocations DB test', () => {
    let leoMessi, leoMessiPurchaseGroup, leoMessiComment;


    it.only('saves a full relation graph', async () => {
        leoMessi = await new User({name: 'leo Messi'});
        leoMessiPurchaseGroup = await new PurchaseGroup({name: 'some testing group'});
        leoMessiComment = await new Comment({
            content: 'i am the best in the world!',
            rating: '5',
            user: leoMessi
        });

        leoMessiPurchaseGroup.comments.push(leoMessiComment);
        leoMessi.purchaseGroupsBought.push(leoMessiPurchaseGroup);
        leoMessiComment.user = leoMessi;

        await leoMessi.save();
        await leoMessiPurchaseGroup.save();
        await leoMessiComment.save();

        let user = await User.findById({_id:leoMessi.id})
            .populate({
                path: 'purchaseGroups',
                populate: {
                    path: 'comments',
                    model: 'comments'
                }
            });
        console.log(user.purchaseGroups[0].comments[0]);
        assert(user.purchaseGroups[0].comments[0].user.toString() === leoMessi.id.toString());
        assert(user.comments[0].author === leoMessiSellerComment.author);
        assert(user.comments[0].content === leoMessiSellerComment.content);
        // console.log(user);
    });
});
