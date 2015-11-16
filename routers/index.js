var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
    var UnauthorizedError = (req.flash('UnauthorizedError') || [{}]).pop();

    res.render('index', {
        UnauthorizedError: UnauthorizedError
    });
});

router.get('/addroom', function(req, res) {
    req.app.models.room.count({}).exec(function countCB(error, roomCount) {
        console.log('Created room with number ' + roomCount);
        req.app.models.room.create({
                number: roomCount
            })
            .then(function(room) {
                req.flash('info', 'Szoba sikeresen felvéve!');
                res.redirect('/');
            })
            .catch(function(err) {
                console.log(err);
            });
    });
});

module.exports = router;
