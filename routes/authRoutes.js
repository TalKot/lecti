"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
// const FacebookStrategy = require('passport-facebook').Strategy;
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
module.exports = (app) => {
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));
    app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
        console.log('loggedIn by google');
        res.redirect('/');
    });
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email'],
    }));
    app.get('/api/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
    app.get('/auth/facebook/callback', passport.authenticate('facebook'), (req, res) => {
        console.log('loggedIn by facebook');
        res.redirect('/');
    });
    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });
};
//# sourceMappingURL=authRoutes.js.map