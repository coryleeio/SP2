var express  = require('express');
var port     = 80;
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var configDB = require('./config/database');
var mandatory = require('./common/config/force-env') // No semicolon.
(['SHARED_SERVER_SECRET','SESSION_KEY', 
'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_CALLBACK_URL']);

var app      = express();

mongoose.connect(configDB.url); 
mongoose.connection.db.dropCollection('servers', function(err, result) {
	if(err) {
		console.log(err);
	}
	console.log("Removed old servers from db")
});

require('./config/passport')(passport); 
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(cookieParser()); 
app.use(bodyParser.json()); 
	app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); 

app.use(session({ secret: process.env.SESSION_KEY })); 
app.use(passport.initialize());
app.use(passport.session()); 

require('./app/routes.js')(app, passport);
app.listen(port);
