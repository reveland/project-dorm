var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
    req.app.models.activity.find()
        .then(function(activity) {
            console.log(activity);
            res.render('activity/list', {
                activity: activity,
                messages: req.flash('info')
            });
        });
});

router.get('/new', function(req, res) {
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();

    res.render('activity/new', {
        validationErrors: validationErrors,
        data: data,
    });
});

router.post('/new', function(req, res) {
    req.checkBody('name', 'Hibás megnevezés').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('alter_energy', 'Must be between -50 and 50').notEmpty().withMessage('Kötelező megadni!').isInt().between(-50, 50);
    req.checkBody('alter_empotional_wb', 'Must be between -50 and 50').notEmpty().withMessage('Kötelező megadni!').isInt().between(-50, 50);
    req.checkBody('alter_physical_wb', 'Must be between -50 and 50').notEmpty().withMessage('Kötelező megadni!').isInt().between(-50, 50);
    req.checkBody('alter_money', 'Must be between -50 and 50').notEmpty().withMessage('Kötelező megadni!').isInt().between(-50, 50);

    var validationErrors = req.validationErrors(true);
    console.log(validationErrors);

    if (validationErrors) {
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/activity/new');
    }
    else {
        req.app.models.activity.create({
                name: req.body.name,
                alter_energy: req.body.alter_energy,
                alter_empotional_wb: req.body.alter_empotional_wb,
                alter_physical_wb: req.body.alter_physical_wb,
                alter_money: req.body.alter_money,
            })
            .then(function(activity) {
                req.flash('info', 'Tevékenység sikeresen felvéve!');
                res.redirect('/activity');
            })
            .catch(function(err) {
                console.log(err);
            });
    }
});

module.exports = router;
