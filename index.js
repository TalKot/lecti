"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const keys = require('./config/keys');
const mongoose = require("mongoose");
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const morgan = require('morgan');
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
//Middlewares
app.use(bodyParser.json()); //req&res body will parse to json
app.use(morgan('combined')); //logs
app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
}));
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
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build')); // serve up production assets
    // if route cannot be found - serve up index.html
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}
//setting up port with Heroku and locally
const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log(`Listening on port ${PORT}`);
//# sourceMappingURL=index.js.map