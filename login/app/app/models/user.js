var mongoose = require('mongoose');
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String

    },
    created_at    : { type: Date, required: true },
    updated_at    : { type: Date, required: true }
});

var common = require('./model_entity.js')(userSchema);

module.exports = mongoose.model('User', userSchema);