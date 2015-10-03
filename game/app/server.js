var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var passportSocketIo = require("passport.socketio");
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var configDB = require('./config/database');
var cookieParser = require('cookie-parser')
var auth      = require('./app/auth');


var mandatory = require('./_sharedServerSide/force-env')([
	'GOOGLE_CLIENT_ID','GOOGLE_CLIENT_SECRET','GOOGLE_CALLBACK_URL','SESSION_KEY','SERVER_REGISTRATION_HOST', 'SERVER_REGISTRATION_PORT','SHARED_SERVER_SECRET','HOST','PORT'
]);
mongoose.connect(configDB.url, function(err) {
  if (err) {
    console.log("Could not connect to database");
    throw err;
  }
});
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,      
  secret:       process.env.SESSION_KEY,   
  store:        new MongoStore({mongooseConnection: mongoose.connection}),        
  success:      auth.onAuthorizeSuccess,  
  fail:         auth.onAuthorizeFail 
}));

require('./_sharedServerSide/config/passport')(passport); 
app.use(passport.initialize());
app.use(passport.session()); 
app.use(cookieParser());

require('./app/heartbeat')();
var routes = require('./app/network')(app, io);
server.listen(3000);
