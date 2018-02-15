"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new mongoose.Schema({
    AuthId: String,
    displayName: String,
    gender: String,
    email: String,
    name: String,
    photoURL: String,
    purchaseGroupsBought: [{
            type: Schema.Types.ObjectId,
            ref: 'purchaseGroups',
            default: []
        }],
    credits: {
        type: Number,
        default: 0
    },
    isSeller: {
        type: Boolean,
        default: false
    },
    comments: [{
            type: Schema.Types.ObjectId,
            ref: 'sellerComment',
            default: []
        }],
    storeName: String,
    storeAddress: String,
    rank: Number,
    purchaseGroupsSell: [{
            type: Schema.Types.ObjectId,
            ref: 'purchaseGroups',
            default: []
        }],
    cart: [{
            type: Schema.Types.ObjectId,
            ref: 'purchaseGroups',
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
//# sourceMappingURL=User.js.map