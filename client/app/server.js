var express  = require('express');
var path     = require('path');
var morgan       = require('morgan');
var mandatory = require('./common/config/force-env') // No semicolon.
([]);

var app      = express();
app.use(morgan('dev'));

app.use('/', express.static(__dirname + '/game'));

app.listen(3000);
console.log('Client server! started');