var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
    req.app.models.room.find()
        .then(function(rooms) {
            console.log(rooms);
            res.render('myRoom/index', {
                rooms: rooms
            });
        });
});

module.exports = router;
