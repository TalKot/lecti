import mongoose = require('mongoose');
const {Schema} = mongoose;

const potentialBuyers = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    amount: {
        type: Number,
        default: 1
    },
    time:{
        type: Date,
        default: Date.now()
    }
});

const purchaseGroup = new mongoose.Schema({
    name: {
        index: true,
        type: String,
        required: [true, 'Name Is Required'],
        validate: {
            validator: (name) => name.length > 2,
            message: 'Name must be longer than 2 characters.'
        }
    },
    priceForGroup: Number,
    originalPrice: Number,
    potentialBuyers: [potentialBuyers],
    category: String,
    type: String,
    description: String,
    isActive : {
        type: Boolean,
        default: true
    },
    totalAmount: Number,
    picture: String,
    sales: {
        type: Number,
        default: 0
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment',
        default: []
    }]

});

purchaseGroup.virtual('discount').get(function () {
    return (this.priceForGroup / this.originalPrice * 100);
});


const PurchaseGroup = mongoose.model('purchaseGroups', purchaseGroup);

module.exports = PurchaseGroup;