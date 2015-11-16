var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var Waterline = require('waterline');
var passport = require('passport');
var hbs = require('hbs');

var facebookConfig = require('./config/facebook');
var waterlineConfig = require('./config/waterline');
var userCollection = require('./models/user');
var roomCollection = require('./models/room');
var residentCollection = require('./models/resident');
var activityCollection = require('./models/activity');

var indexRouter = require('./routers/index');
var loginRouter = require('./routers/login');
var facebookRouter = require('./routers/facebook');
var myroomRouter = require('./routers/myroom');
var operatorRouter = require('./routers/operator');
var activityRouter = require('./routers/activity');
var profileRouter = require('./routers/profile');

var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Local Strategy for sign-up
passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    req.app.models.user.findOne({
      email: email
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, false, {
          message: 'Létező email.'
        });
      }
      req.app.models.user.create(req.body)
        .then(function(user) {
          return done(null, user);
        })
        .catch(function(err) {
          return done(null, false, {
            message: err.details
          });
        })
    });
  }
));
// Local Strategy for Log-in
passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    req.app.models.user.findOne({
      email: email
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user || !user.validPassword(password)) {
        return done(null, false, {
          message: 'Helytelen adatok.'
        });
      }
      return done(null, user);
    });
  }
));
// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: facebookConfig.facebook_api_key,
    clientSecret: facebookConfig.facebook_api_secret,
    callbackURL: facebookConfig.callback_url,
    profileFields: ['id', 'displayName', 'emails']
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      app.models.user.findOne({
        email: profile.emails[0].value
      }, function(err, user) {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, user);
        }
        else {
          app.models.user.create({
              fbid: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value
            })
            .then(function(user) {
              return done(null, user);
            })
            .catch(function(err) {
              console.log(err);
              return done(null, false, {
                message: err.details
              });
            });
        }
      });
    });
  }
));

// Middleware segédfüggvények
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function setLocalsForLayout() {
  return function(req, res, next) {
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.user = req.user;
    next();
  };
}

function andRestrictTo(role) {
  return function(req, res, next) {
    if (req.user.role == role) {
      next();
    }
    else {
      req.flash('UnauthorizedError', new Error('UnauthorizedError'));
      res.redirect('/');
    }
  };
}

//  express app
var app = express();

//config
app.set('views', './views');
app.set('view engine', 'hbs');
hbs.registerHelper("ifvalue", function(conditional, options) {
    if (conditional == options.hash.equals) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

//middlewares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(expressValidator({
  customValidators: {
    between: function(param, low, high) {
      return param >= low & param <= high;
    }
  }
}));
app.use(session({
  cookie: {
    maxAge: 600000
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

app.use('/auth/facebook', facebookRouter);

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.use('/operator', ensureAuthenticated, andRestrictTo('operator'), operatorRouter);
//app.use('/operator', operatorRouter);

app.use('/myroom', ensureAuthenticated, myroomRouter);

app.use('/activity', activityRouter);

app.use('/profile/', ensureAuthenticated, profileRouter);

// ORM config
var orm = new Waterline();
orm.loadCollection(Waterline.Collection.extend(userCollection));
orm.loadCollection(Waterline.Collection.extend(roomCollection));
orm.loadCollection(Waterline.Collection.extend(residentCollection));
orm.loadCollection(Waterline.Collection.extend(activityCollection));

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
