var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model('users');
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
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
}, 
//will be called when the auth flow is complete
(accessToken, refreshToken, profile, done) => __awaiter(this, void 0, void 0, function* () {
    const { displayName, id, gender } = profile;
    let existingUser = yield User.findOne({ email: profile.emails[0].value });
    existingUser = existingUser.toObject();
    if (existingUser) {
        //user is already in the DB
        return done(null, existingUser);
    }
    //new user - should be save to the DB
    const user = new User({
        Id: id,
        displayName,
        gender: gender,
        email: profile.emails[0].value,
        photoURL: profile.photos[0].value
    });
    yield user.save();
    done(null, user);
})));
passport.use(new FacebookStrategy({
    clientID: keys.facebookClientID,
    clientSecret: keys.facebookClientSecret,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['email', "id", "birthday", "first_name", "gender", "last_name", "picture.width(400).height(400)"],
    proxy: true
}, 
//will be called when the auth flow is complete
(accessToken, refreshToken, profile, done) => __awaiter(this, void 0, void 0, function* () {
    const { first_name, last_name, gender, email } = profile._json;
    let existingUser = yield User.findOne({ email });
    existingUser = existingUser.toObject();
    if (existingUser) {
        return done(null, existingUser);
    }
    const user = new User({
        Id: profile.id,
        displayName: `${first_name} ${last_name}`,
        gender: gender,
        email: profile._json.email,
        photoURL: profile.photos[0].value
    });
    yield user.save();
    done(null, user);
})));
//# sourceMappingURL=passport.js.map