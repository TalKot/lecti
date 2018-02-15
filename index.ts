const express = require('express');
const keys = require('./config/keys');
import * as mongoose from 'mongoose';
const cookieSession = require('cookie-session');
const passport = require('passport');

//loading all models
require('./models/Comment');
require('./models/SellerComment');
require('./models/PurchaseGroup');
require('./models/User');
// require('./models/Survey');

//loading passport library to server
require('./services/passport');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {
    useMongoClient: true
});

const app = express();

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());

//setting up routes
require('./routes/authRoutes')(app);
require('./routes/purchaseGroupRoutes')(app);

//setting up port with Heroku and locally
const PORT = process.env.PORT || 5000;
app.listen(PORT);


console.log('app listen on port 5000');