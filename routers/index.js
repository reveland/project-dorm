var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
    var UnauthorizedError = (req.flash('UnauthorizedError') || [{}]).pop();

    res.render('index', {
        UnauthorizedError: UnauthorizedError
    });
});

module.exports = router;
