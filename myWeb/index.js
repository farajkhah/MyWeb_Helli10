const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/helli10').then(function(){
    console.log('Database connected');
});

const User = mongoose.model('User', new mongoose.Schema({ 
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    password: String,
}));

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
app.get('/register', function(req, res){
    res.render('register');
});
app.post('/register', function(req, res){
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    if(password != password2){
        res.send('تایید رمز عبور صحیح نمیباشد');
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
})


app.listen(3000);