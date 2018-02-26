import mongoose = require('mongoose');
const {Schema} = mongoose;
import * as _ from 'lodash';

const potentialBuyers = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    amount: {
        type: Number,
        default: 1
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
    isActive : {
        type: Boolean,
        default: true
    },
    totalAmount: Number,
    picture: String,
    salesDay: {
        type: [Number],
        default: [0]
    },
    salesWeek: {
        type: [Number],
        default: [0]
    },
    salesMonth: {
        type: [Number],
        default: [0]
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

purchaseGroup.virtual('totalSales').get(function () {
    let totalSales = [...this.salesDay, ...this.salesWeek, ...this.salesMonth];
    return _.reduce(totalSales, (sum, n) => {
        return sum + n;
    }, 0);
});

purchaseGroup.virtual('discount').get(function () {
    return (this.priceForGroup / this.originalPrice * 100);
});


const PurchaseGroup = mongoose.model('purchaseGroups', purchaseGroup);

module.exports = PurchaseGroup;