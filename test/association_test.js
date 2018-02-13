const User = require('../models/User');
const Comment = require('../models/Comment');
const PurchaseGroup = require('../models/PurchaseGroup');
const SellerComment = require('../models/SellerComment');
const assert = require('assert');

describe('Assocations DB test', () => {
    let leoMessi, leoMessiPurchaseGroup, leoMessiComment,leoMessiSellerComment;


    it('saves a full relation graph', async () => {
        leoMessi = await new User({name: 'leo Messi'});
        leoMessiPurchaseGroup = await new PurchaseGroup({name: 'some testing group'});
        leoMessiComment = await new Comment({
            author: 'Leo Messi',
            content: 'i am the best in the world!',
            rating: '5',
            user: leoMessi
        });

        leoMessiSellerComment = await new SellerComment({
            author: "me",
            content: "not the best book seller in the world but the best football player!",
            rating: 3,
            user:leoMessi._id
        });

        // leoMessiComment.user = leoMessi;
        leoMessiPurchaseGroup.comments.push(leoMessiComment);
        leoMessi.purchaseGroups.push(leoMessiPurchaseGroup);
        leoMessi.comments.push(leoMessiSellerComment);
        leoMessiComment.user = leoMessi;

        await leoMessi.save();
        await leoMessiPurchaseGroup.save();
        await leoMessiComment.save();
        await leoMessiSellerComment.save();

        let user = await User.findById({_id:leoMessi.id})
            .populate({
                path: 'purchaseGroups',
                populate: {
                    path: 'comments',
                    model: 'comments'
                }
            })
            .populate({
                path:'comments',
                model: 'sellerComment'
            });
        // console.log(user);
        assert(user.purchaseGroups[0].comments[0].user.toString() === leoMessi.id.toString());
        assert(user.comments[0].author === leoMessiSellerComment.author);
        assert(user.comments[0].content === leoMessiSellerComment.content);
        console.log(user);
    });
});
