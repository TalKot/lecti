const mongoose = require('mongoose');
const keys = require('../config/keys');
const User = require('../models/User');
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
//
//
// afterEach(() => {
//     let usersToRemove = User.find({name: 'leo Messi'});
//     usersToRemove.forEach(async user => {
//         await User.findOneAndRemove(user)
//     });
//
// });