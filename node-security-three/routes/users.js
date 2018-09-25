var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var User = require('../models/userModel');
var presentUser;

var questionDay = " ";
var questionCount=" ";
var searchDay='';
var searchCount='';
var scrollDay='';
var scrollCount='';





/* GET users listing. */



router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res, next) {
    res.render('signup',{
        formHeading: 'Signup form',
        title: 'Signup page',
        style: 'login.css',
        isLoggedin: false,
        js: ''
    });
});

router.get('/login', function(req, res, next) {
    // console.log("I'm at /users/login get");
    res.render('login',{
        formHeading: 'Login form',
        title: 'Login page',
        style: 'login.css',
        isLoggedin: false,
        js: ''
    });
});



router.post('/signup', function(req, res, next) {
    // console.log("I am at /users/signup post req");
    //console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    // form validator
    req.checkBody('username','username field is required').notEmpty();
    req.checkBody('password','password field is required').notEmpty();
    req.checkBody('password2','password does not match').equals(req.body.password);

    // check errors
    var errors = req.validationErrors();

    if(errors){
        console.log('errors');
        res.render('signup',{
            formHeading: 'Signup form',
            title: 'Signup page',
            style: 'login.css',
            errors: 'Incorrect username or password',
            js: ''
        });

    }else{
        console.log('No errors');
        var newUser = new User.User({
            username,
            password

        });
        User.createUser(newUser, function (err,user) {

            if(err){
                res.render('signup',{
                    formHeading: 'Signup form',
                    title: 'Signup page',
                    style: 'login.css',
                    errors: 'User account already exist',
                    js: ''
                });

                throw err;
                return;
            }
            // console.log(user);
        });
        res.redirect('/users/login');

    }

});


// This has to be protected private route
router.get('/member', ensureAuthenticated ,function(req, res, next) {

    console.log(`form /users/member `);
    console.log(req);
    User.saveTimeStamp(req.user, function(err,user){
        if(err){
            console.log('error is from /users/member, cannot save login time stamp.');

        }
    });

    res.render('member',{
        title: 'Member page',
        style: 'login.css',
        isLoggedin: true,
        username: req.user.username,
        history: req.user.history,
    });
});

function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/login');
}



router.post('/login',
    passport.authenticate('local',{failureRedirect:'/users/login'}),
    function(req, res) {
        res.redirect('/users/member');
    });

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(function(username,password,done){
    User.getUserByUsername(username,function(err,user){
        if(err) throw err;

        if(!user){  // if user file is not there in the database.
            return done(null,false,{message:'Unknown user'});
        }

        // compare entered password and db stored password.
        User.comparePassword(password,user.password,function(err,isMatch){
           if(err) return done(err);

           if(isMatch){
               return done(null, user)
           } else{
               return done(null,false,{message: 'Invalid password'});
           }
        });
    })
}));


router.get('/logout', function(req, res, next) {
    req.logout();
    presentUser = undefined;
    res.redirect("/");
});



// This has to be protected private route
router.get('/java', ensureAuthenticated ,function(req, res, next) {
    presentUser = req.user;
    console.log(`form /users/java `);
    console.log(req);

    res.sendfile('./public/Java.html');
});

/*--------------------------------- FOR behavior logging.  -----------------*/

router.get('/visualize',ensureAuthenticated, function(req, res, next) {

    console.log('from /users/visualize');
     console.log(req.user);

     temp = req.user.question;
    for(var i=0;i<temp.length;i++){
        questionDay += temp[i].Day+" ";
        questionCount += temp[i].count+" ";
    }

    temp = req.user.search;
    for(var i=0;i<temp.length;i++){
        searchDay += temp[i].Day+" ";
        searchCount += temp[i].count+" ";
    }

    temp = req.user.pageScroll;
    for(var i=0;i<temp.length;i++){
        scrollDay += temp[i].Day+" ";
        scrollCount += temp[i].count+" ";
    }




    if(questionDay!=='' && questionCount!=='' && searchDay!=='' && searchCount!=='' && scrollDay!=='' && scrollCount!==''){
        res.render('visualize', {
            title: 'Visualize page',
            style: 'visualize.css',
            isLoggedin: true,
            questionDay: questionDay,
            questionCount: questionCount,
            searchDay:searchDay,
            searchCount: searchCount,
            scrollDay: scrollDay,
            scrollCount:scrollCount
        })
    }

    questionDay = '';questionCount='';searchDay='';searchCount='';scrollDay='';scrollCount='';
});


router.post('/updateDB',function(req, res, next) {

    User.captureQuestion(presentUser, req.body.questionCount, function(err,presentUser){
        if(err){
            console.log('error is from /users/bquestion, db eroor ');
        }
    });

    User.captureScroll(presentUser, req.body.scrollCount, function(err,presentUser){
        if(err){
            console.log('error is from /users/bscroll, db error. ');
        }
    });

    User.captureSearch(presentUser,req.body.searchCount,function(err,presentUser){
        if(err){
            console.log('error is from /users/bscroll, db error. ');
        }
    });

});


module.exports = router;
