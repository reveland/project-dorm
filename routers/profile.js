var express = require('express');

var router = express.Router();

router.get('/', function (req, res) {
    res.render('profile/index');
});
router.get('/change/password', function (req, res) {
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();

    res.render('profile/password', {
        validationErrors: validationErrors,
    });
});

router.post('/change/password', function (req, res) {
    console.log(req.body);
    req.checkBody('new_pwd', 'Hibás új jelszó').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('old_pwd', 'Hibás jelenlegi jelszó').notEmpty().withMessage('Kötelező megadni!');

    var validationErrors = req.validationErrors(true);
    console.log(validationErrors);
    if (validationErrors) {
        req.flash('validationErrors', validationErrors);
        res.redirect('/profile/change/password');
    }
    else {
        req.app.models.user.findOne({
            id: req.user.id
        }, function (err, user) {
            if (err) {
            }
            if (!user.validPassword(req.body.old_pwd)) {
                //Helytelen jelenlegi jelszó
                req.flash('errorMessages', 'Helytelen jelenlegi jelszó!');
                res.redirect('/profile/change/password');
            }
            else {
                req.app.models.user.update({
                        id: req.user.id
                    }, {
                        password: req.body.new_pwd
                    })
                    .then(function (user) {
                        req.flash('info', 'Jelszó sikeresen megváltoztatva!');
                        res.redirect('/profile');
                    });
            }
        });
    }
});

module.exports = router;
