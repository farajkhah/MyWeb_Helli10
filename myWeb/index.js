const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const {ensureAuthenticated} = require('./config/auth');
const passport = require('passport');

const mongoose = require('mongoose');
const User = require('./models/User');

// Database Connection
mongoose.connect('mongodb://localhost:27017/helli10').then(function(){
    console.log('Database connected');
});

// express session middleware
const{
    SESS_NAME = 'sid',
    SESS_TIME = 1000 * 60 * 60 * 2 
} = process.env

app.use(session({
    name: SESS_NAME,
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: SESS_TIME ,
        sameSite: true,
        secure: false
    }
}));

// connect flash
app.use(flash());

//Global vars
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// passport config
require('./config/passports')(passport);
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);



app.use(express.static(path.join(__dirname, 'public')));
app.set('views', './views');
app.set('view engine', 'jade');

app.get('/', function(req, res){
    res.render('home');
});
app.get('/login', function(req, res){
    res.render('login');
});
app.post('/login', function(req, res, next){
    var {username, password} = req.body;
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});
app.get('/register', function(req, res){
    res.render('register');
});
app.post('/register', function(req, res){
    var {firstName, lastName, username, email, password, password2} = req.body;
    if(password != password2){
        res.send('تایید رمز عبور صحیح نمیباشد');
    }
    else if(password.length < 4){
        res.send('رمز عبور بسیار ضعیف است.')
    }
    else{
        var user = new User({
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: password,
        });
        user.save().then(function(){
            res.render('login');
        });
    }
});

app.get('/dashboard', ensureAuthenticated, function(req, res){
    res.render('dashboard', {
        user: req.user,
    });
});

app.get('/logout', function(req, res){
    req.logOut();
    req.flash('success_msg', 'شما با موفقیت خارج شدید');
    res.redirect('/login');
});




app.listen(3000);