import passport = require('passport');

module.exports = (app) => {
    app.get('/auth/google', passport.authenticate('google', {
            scope: ['profile', 'email']
        })
    );

    app.get(
        '/auth/google/callback',
        passport.authenticate('google'), (req, res) => {
            // console.log('loggedIn by google');
            res.redirect('/home');
        }
    );

    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email'],
    }));

    app.get('/api/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook'), (req, res) => {
            // console.log('loggedIn by facebook');
            res.redirect('/home');
        });

    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });

};