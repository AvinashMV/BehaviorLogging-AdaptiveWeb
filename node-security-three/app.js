var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var validator = require('express-validator');
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var db = mongoose.connection;
var jwt = require('jsonwebtoken');

var handlebars  = require('./helpers/handlebars.js')(hbs);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout', layoutsDir:__dirname+'/views/layouts'}));
app.set('views',__dirname+'/views');
app.set('view engine', 'hbs');


// set app for body parser
app.use(bodyParser.json());
app.use(validator());

// middlewar for sessions.
app.use(session({
    secret:'secret',
    saveUninitialized: 'true',
    resave: 'true'
}));


// passport
app.use(passport.initialize());
app.use(passport.session());

// validator

// express-messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname+'/public'));


// setting user global var
app.get('*', function(req,res,next){
    res.locals.user = req.user || null;
    console.log(`now user global var is ${res.locals.user}`);
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





module.exports = app;

