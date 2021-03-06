var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const keys = require('./config/keys');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const purchaseGroupSchema = require('./models/PurchaseGroup');
const userSchema = require('./models/User');
const PurchaseGroupData = require('./data/PurchaseGroupData');
const UserData = require('./data/UserData');
//loading all models
require('./models/Comment');
require('./models/PurchaseGroup');
require('./models/User');
const CustomPurchaseGroupsSelector = require('./services/customPurchaseGropusSelector/customPurchaseGropusSelector');
//loading passport library to server
const User = mongoose.model('users');
require('./services/passportLogin/passport');
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {
    useMongoClient: true
});
const app = express();
//Middlewares
app.use(bodyParser.json()); //req&res body will parse to json
app.use(morgan('combined')); //logs
app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());
//setting up routes
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/purchaseGroupRoutes')(app);
require('./routes/cartRoutes')(app);
require('./routes/userRoutes')(app);
require('./routes/commentRoutes')(app);
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build')); // serve up production assets
    // if route cannot be found - serve up index.html
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}
// will call start notify once.
_.once(() => __awaiter(this, void 0, void 0, function* () {
    const isTrueSet = (keys.loadData == 'true');
    if (isTrueSet) {
        console.log('Loading data...');
        //load and store user data to DB
        const user = new userSchema(UserData);
        yield user.save();
        //load and store purchase group data to DB
        PurchaseGroupData.forEach((purchaseGroup) => __awaiter(this, void 0, void 0, function* () {
            let purchaseGroupObject = new purchaseGroupSchema(purchaseGroup);
            if (!purchaseGroupObject.isSuggestion) {
                purchaseGroupObject.seller = user;
                user.purchaseGroupsSell.push(purchaseGroupObject);
            }
            purchaseGroupObject.save();
        }));
        yield user.save();
        //notifications system
        const customPurchaseGroupsSelector = CustomPurchaseGroupsSelector.default.Instance;
        console.log('starting the notify process');
        customPurchaseGroupsSelector.notify();
    }
}))();
//setting up port with Heroku and locally
const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log(`Listening On Port - ${PORT}`);
//# sourceMappingURL=index.js.map