const mongoose = require('mongoose');

var User = mongoose.model('User', { //document model
    email:{
        type: String,
        required: true,
        minLength: 1,//no empty string
        trim: true
    }
})

module.exports = {User};