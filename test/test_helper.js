const mongoose = require('mongoose');
const keys = require('../config/keys');
mongoose.Promise = global.Promise;

before((done) => {
    mongoose.connect(keys.mongoURI, {
        useMongoClient: true
    });
    mongoose.connection
        .once('open', () => {

            done();
        })
        .on('error', (error) => {
            console.warn('Warning', error);
        });
});

// beforeEach(async () => {
//     const { users, comments, purchasegroups,sellercomments } = mongoose.connection.collections;
//     try {
//         await Promise.all([users.drop(), comments.drop(), purchasegroups.drop(),sellercomments.drop()])
//     }catch (e){
//         console.error(e)
//     }
// });

