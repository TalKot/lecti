const express = require('express');
const keys = require('./config/keys');
import * as mongoose from 'mongoose';
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const PurchaseGroupData = require('./data/PurchaseGroupData');
const PurchaseGroup = require('./models/PurchaseGroup');
//loading all models
require('./models/Comment');
require('./models/SellerComment');
require('./models/PurchaseGroup');
require('./models/User');
require('./models/Survey');

//loading passport library to server
require('./services/passportLogin/passport');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {
    useMongoClient: true
});

const app = express();
//Middlewares
app.use(bodyParser.json()); //req&res body will parse to json
app.use(morgan('combined'));//logs
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
require('./routes/billingRoutes')(app);
require('./routes/purchaseGroupRoutes')(app);
require('./routes/cartRoutes')(app);
require('./routes/surveyRoutes')(app);
require('./routes/userRoutes')(app);


if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build')); // serve up production assets

    // if route cannot be found - serve up index.html
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

//will call start notify once.
_.once(() => {
    //notifications system
    //const customPurchaseGroupsSelector = CustomPurchaseGroupsSelector.Instance;
    //customPurchaseGroupsSelector.notify();

    //load and store data to DB
    PurchaseGroupData.forEach(async purchaseGroup=>{
        let res = new PurchaseGroup(purchaseGroup);
        await res.save();
    });
})();



//setting up port with Heroku and locally
const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log(`Listening on port ${PORT}`);