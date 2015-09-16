var mongoose = require('mongoose');

// define the schema for our user model
var serverSchema = mongoose.Schema({
        host       : { type: String, required: true},
        port       : { type: Number, min: 1, max: 65535, required: true },
        load       : { type: Number, min: 0.0, max: 1.0, required: true }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Server', serverSchema);