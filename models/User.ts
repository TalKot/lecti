import mongoose = require('mongoose');

const {Schema} = mongoose;

const PurchaseGroups = Schema({
    purchaseGroup: {
        type: Schema.Types.ObjectId,
        ref: 'purchaseGroups'
    },
    amount: {
        type: Number,
        default: 1
    }
});

const userSchema = new mongoose.Schema({
    AuthId: String,
    displayName: String,
    gender: String,
    email: String,
    name: String,
    photoURL: String,
    credits: {
        type: Number,
        default: 0
    },
    isSeller: {
        type: Boolean,
        default: false
    },
    storeName: String,
    storeAddress: String,
    rank: Number,
    purchaseGroupsSell: [{
        type: Schema.Types.ObjectId,
        ref: 'purchaseGroups',
        default: []
    }],
    purchaseGroupsBought: [PurchaseGroups],
    cart: [PurchaseGroups],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'sellerComment',
        default: []
    }]
});

userSchema.virtual('commentsCount').get(function () {
    return this.comments.length;
});

userSchema.virtual('purchaseGroupsCount').get(function () {
    return this.purchaseGroups.length;
});

const User = mongoose.model('users', userSchema);
module.exports = User;