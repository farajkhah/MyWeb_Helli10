const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({ 
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    password: String,
    photos: {type: [Object], default: []},
}));

module.exports = User;