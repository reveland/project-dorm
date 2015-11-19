var express = require('express');

var router = express.Router();

router.get('/', function (req, res) {
    if (!req.user.hasRoom) {
        req.app.models.room.find()
            .then(function (rooms) {
                res.render('myroom/index', {
                    rooms: rooms
                });
            });
    }
    else {
        req.app.models.room.findOne({
                id: req.user.room
            })
            .then(function (room) {
                req.app.models.resident.find({
                        room: room.id
                    })
                    .then(function (residents) {
                        req.app.models.activity.find()
                            .then(function (activity) {
                                res.render('myroom/index', {
                                    room: room,
                                    residents: residents,
                                    activity: activity
                                });
                            });
                    });
            });
    }
});

router.get('/occupy/:id', function (req, res) {
    if (!req.user.hasRoom) {
        var id = req.params.id;
        req.app.models.room.findOne({
                id: id
            })
            .then(function (room) {
                req.app.models.user.update({
                        id: req.user.id
                    }, {
                        room: room.id,
                        hasRoom: true
                    })
                    .then(function (room) {
                    });

                req.user.room = room.id;
                req.user.hasRoom = true;
                res.redirect('/myroom');
            });
    }
    else {
        res.redirect('/myroom');
    }
});

router.get('/addresident', function (req, res) {
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();

    res.render('operator/resident/new', {
        validationErrors: validationErrors,
        data: data,
    });
});

router.post('/addresident', function (req, res) {
    req.checkBody('name', 'Hibás név').notEmpty().withMessage('Kötelező megadni!');
    req.sanitizeBody('description').escape();
    req.checkBody('description', 'Hibás leírás').notEmpty().withMessage('Kötelező megadni!');

    var validationErrors = req.validationErrors(true);
    console.log(validationErrors);

    if (validationErrors) {
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/myroom/addresident');
    }
    else {
        req.app.models.resident.create({
                name: req.body.name,
                description: req.body.description
            })
            .then(function (resident) {
                req.app.models.room.update({
                        id: req.user.room
                    }, {
                        occupied: true
                    })
                    .then(function (room) {
                    });
                req.app.models.room.findOne({
                        id: req.user.room
                    })
                    .then(function (room) {
                        console.log('word');
                        console.log(room);
                        console.log(room.residents);
                        room.occupied = true;
                        room.residents.add(resident.id);
                        room.save(function (err) {
                        });
                    });
                res.redirect('/myroom');
            })
            .catch(function (err) {
                console.log(err);
            });
    }
});

router.post('/', function (req, res) {
    console.log(req.body);
    req.app.models.resident.findOne({
            id: req.body.resident
        })
        .then(function (resident) {
            console.log(resident);
            req.app.models.activity.findOne({
                    id: req.body.activity
                })
                .then(function (activity) {
                    console.log(activity);
                    resident.doActivity(activity);
                    resident.save(function (err) {
                    });
                    res.redirect('/myroom');
                });
        });
});

module.exports = router;
