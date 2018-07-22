const mongoose = require('mongoose');

var Todo = mongoose.model('Todo', { //document model
    text:{
        type: String,
        required: true,
        minLength: 1,//no empty string
        trim: true
    },
    completed:{
        type: Boolean,
        default: false  //default value
    },
    completedAt:{
        type: Number,
        default: null
    }
})

module.exports = {Todo};