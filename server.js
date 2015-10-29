var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var Waterline = require('waterline');
var passport = require('passport');

var facebookConfig = require('./config/facebook')
var waterlineConfig = require('./config/waterline');
var userCollection = require('./models/user');
var roomCollection = require('./models/room');
var residentCollection = require('./models/resident');

var indexRouter = require('./routers/index');
var loginRouter = require('./routers/login');

//==========================================================

var FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: facebookConfig.facebook_api_key,
    clientSecret: facebookConfig.facebook_api_secret,
    callbackURL: facebookConfig.callback_url
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      app.models.user.findOne({
        facebook_id: profile.id
      }, function(err, user) {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, user);
        }
        else {
          app.models.user.create({
              id: profile.id,
              name: profile.displayName
            })
            .then(function(user) {
              return done(null, user);
            })
            .catch(function(err) {
              return done(null, false, {
                message: err.details
              });
            })
        }
      });
    });
  }
));

// Middleware segédfüggvény
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}

function setLocalsForLayout() {
  return function(req, res, next) {
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.user = req.user;
    next();
  }
}

//-------------------------------------------
//  express app
var app = express();

//config
app.set('views', './views');
app.set('view engine', 'hbs');

//middlewares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(expressValidator());
app.use(session({
  cookie: {
    maxAge: 60000
  },
  secret: 'titkos szoveg',
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(setLocalsForLayout());

//endpoints
app.use('/', indexRouter);

app.use('/login', loginRouter);

app.get('/operator/', function(req, res) {
  res.render('operator/index');
});

app.get('/operator/room', function(req, res) {
  /*
    app.models.room.create({
      number: 1
    }).exec(function createCB(err, created) {
      console.log('Created room with number ' + 1);
    });
  
    app.models.room.create({
      number: 2
    }).exec(function createCB(err, created) {
      console.log('Created room with number ' + 2);
    });
    app.models.room.create({
      number: 3
    }).exec(function createCB(err, created) {
      console.log('Created room with number ' + 3);
    });
    */
  req.app.models.room.find()
    .then(function(rooms) {
      console.log(rooms);
      res.render('operator/room/index', {
        rooms: rooms
      });
    });
});

app.get('/operator/resident', function(req, res) {
  /*
    app.models.room.create({
      number: 1
    }).exec(function createCB(err, created) {
      console.log('Created room with number ' + 1);
    });
  
    app.models.room.create({
      number: 2
    }).exec(function createCB(err, created) {
      console.log('Created room with number ' + 2);
    });
    app.models.room.create({
      number: 3
    }).exec(function createCB(err, created) {
      console.log('Created room with number ' + 3);
    });
    */
  req.app.models.resident.find()
    .then(function(resident) {
      console.log(resident);
      res.render('operator/resident/index', {
        resident: resident
      });
    });
});

app.get('/operator/room/new', function(req, res) {
  app.models.room.count({}).exec(function countCB(error, roomCount) {
    console.log('Created room with number ' + roomCount);
    app.models.room.create({
      number: roomCount
    }).exec(function createCB(err, created) {
      console.log('Created room with number ' + roomCount);
    });
    res.redirect('/operator/room')
  });
});

app.get('/operator/resident/new', function(req, res) {
  var validationErrors = (req.flash('validationErrors') || [{}]).pop();
  var data = (req.flash('data') || [{}]).pop();

  res.render('operator/resident/new', {
    validationErrors: validationErrors,
    data: data,
  });
});

app.post('/operator/resident/new', function(req, res) {
  req.checkBody('name', 'Hibás név').notEmpty().withMessage('Kötelező megadni!');
  req.sanitizeBody('leiras').escape();
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
        req.flash('info', 'Hiba sikeresen felvéve!');
        res.redirect('/operator/resident');
      })
      .catch(function(err) {
        console.log(err);
      });
  }
});

//Passport Router
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  }),
  function(req, res) {
    res.redirect('/');
  });
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

var orm = new Waterline();
orm.loadCollection(Waterline.Collection.extend(userCollection));
orm.loadCollection(Waterline.Collection.extend(roomCollection));
orm.loadCollection(Waterline.Collection.extend(residentCollection));

// ORM indítása
orm.initialize(waterlineConfig, function(err, models) {
  if (err) throw err;

  app.models = models.collections;
  app.connections = models.connections;

  // Start Server
  var port = process.env.PORT || 3000;
  app.listen(port, function() {
    console.log('Server is started.');
  });

  console.log("ORM is started.");
});