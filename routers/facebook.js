var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/', passport.authenticate('facebook', {
    scope: ['email']
}));

router.get('/callback', passport.authenticate('facebook', {
        successRedirect: '/myRoom',
        failureRedirect: '/login'
    }),
    function(req, res) {
        res.redirect('/');
    });

module.exports = router;
