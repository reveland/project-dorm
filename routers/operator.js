var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {

    res.render('operator/index');
});

router.get('/room', function(req, res) {
    req.app.models.room.find()
        .then(function(rooms) {
            console.log(rooms);
            res.render('operator/room/index', {
                rooms: rooms,
                messages: req.flash('info')
            });
        });
});

router.get('/room/new', function(req, res) {
    req.app.models.room.count({}).exec(function countCB(error, roomCount) {
        console.log('Created room with number ' + roomCount);
        req.app.models.room.create({
                number: roomCount
            })
            .then(function(resident) {
                req.flash('info', 'Szoba sikeresen felvéve!');
                res.redirect('/operator/room');
            })
            .catch(function(err) {
                console.log(err);
            });
    });
});

router.get('/resident', function(req, res) {
    req.app.models.resident.find()
        .then(function(resident) {
            console.log(resident);
            res.render('operator/resident/index', {
                resident: resident,
                messages: req.flash('info')
            });
        });
});

router.get('/resident/new', function(req, res) {
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();

    res.render('operator/resident/new', {
        validationErrors: validationErrors,
        data: data,
    });
});

router.post('/resident/new', function(req, res) {
    req.checkBody('name', 'Hibás név').notEmpty().withMessage('Kötelező megadni!');
    req.sanitizeBody('description').escape();
    req.checkBody('description', 'Hibás leírás').notEmpty().withMessage('Kötelező megadni!');

    var validationErrors = req.validationErrors(true);
    console.log(validationErrors);

    if (validationErrors) {
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/operator/resident/new');
    }
    else {
        req.app.models.resident.create({
                name: req.body.name,
                description: req.body.description
            })
            .then(function(resident) {
                req.flash('info', 'Lakó sikeresen felvéve!');
                res.redirect('/operator/resident');
            })
            .catch(function(err) {
                console.log(err);
            });
    }
});

router.get('/resident/delete/:id', function(req, res) {
    var id = req.params.id;
    req.app.models.resident.destroy({
            id: id
        })
        .then(function(deletedErrors) {
            res.redirect('/operator/resident/');
        });
});

module.exports = router;
