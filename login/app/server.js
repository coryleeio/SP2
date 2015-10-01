var express  = require('express');
var port     = 80;
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var MongoStore = require('connect-mongo')(session);
var configDB = require('./config/database');
var mandatory = require('./_common/serverside/force-env')([
	'SHARED_SERVER_SECRET','SESSION_KEY', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_CALLBACK_URL'
]);

var app      = express();
//-> CONFIGURATION
mongoose.connect(configDB.url, function(err) {
  if (err) {
    console.log("Could not connect to database");
    throw err;
  }
});
mongoose.connection.db.dropCollection('servers', function(err, result) {
	if(err) {
		console.log(err);
	}
	console.log("Removed old servers from db")
});


app.use(express.static(__dirname + '/app/public'));
app.use('/common', express.static(__dirname + '/_common/serverclient'));
app.use(morgan('dev'));
app.use(cookieParser()); 
app.use(bodyParser.json()); 
	app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'app/templates'));
app.set('view engine', 'ejs'); 

app.use(session({ 
	secret: process.env.SESSION_KEY,
	store: new MongoStore({mongooseConnection: mongoose.connection})
})); 
require('./_common/serverside/config/passport')(passport); 
app.use(passport.initialize());
app.use(passport.session()); 

require('./config/routes')(app, passport);
app.listen(port);
