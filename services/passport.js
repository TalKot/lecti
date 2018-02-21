"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const passport = require("passport");
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const { googleClientID, googleClientSecret, facebookClientID, facebookClientSecret } = require('../config/keys');
//how to encrypt userId before sending token it to client's browser
passport.serializeUser((user, done) => {
    done(null, user.id);
});
//how to decrypt when getting token from user's browser
passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});
passport.use(new GoogleStrategy({
    clientID: googleClientID,
    clientSecret: googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
}, 
//will be called when the auth flow is complete
(accessToken, refreshToken, profile, done) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const { displayName, id, gender } = profile;
    let existingUser = yield User.findOne({ email: profile.emails[0].value });
    if (existingUser) {
        //user is already in the DB
        // existingUser = existingUser.toObject();
        return done(null, existingUser);
    }
    //new user - should be save to the DB
    const user = new User({
        AuthId: id,
        displayName,
        gender: gender,
        email: profile.emails[0].value,
        photoURL: profile.photos[0].value
    });
    yield user.save();
    done(null, user);
})));
passport.use(new FacebookStrategy({
    clientID: facebookClientID,
    clientSecret: facebookClientSecret,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['email', "id", "birthday", "first_name", "gender", "last_name", "picture.width(400).height(400)"],
    proxy: true
}, 
//will be called when the auth flow is complete
(accessToken, refreshToken, profile, done) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const { first_name, last_name, gender, email } = profile._json;
    let existingUser = yield User.findOne({ email });
    if (existingUser) {
        // existingUser = existingUser.toObject();
        return done(null, existingUser);
    }
    const user = new User({
        AuthId: profile.id,
        displayName: `${first_name} ${last_name}`,
        gender: gender,
        email: profile._json.email,
        photoURL: profile.photos[0].value
    });
    yield user.save();
    done(null, user);
})));
//# sourceMappingURL=passport.js.map