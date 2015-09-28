var http = require('http');
var mongoose = require('mongoose');
var passportSocketIo = require("passport.socketio");
var express = require('express');
var session = require('express-session');
var sessionStore = require('connect-mongo')(session);
var configDB = require('./config/database');
var io = require('socket.io')();
var cookieParser = require('cookie-parser')
var heartBeat = require('./app/heartbeat.js');
var auth      = require('./app/auth');
var mandatory = require('./_common/serverside/force-env')([
	'SESSION_KEY','SERVER_REGISTRATION_HOST', 'SERVER_REGISTRATION_PORT','SHARED_SERVER_SECRET','HOST','PORT'
]);


mongoose.connect(configDB.url); 
io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,       // the same middleware you registrer in express
  secret:       process.env.SESSION_KEY,,    // the session_secret to parse the cookie
  store:        sessionStore,        // we NEED to use a sessionstore. no memorystore please
  success:      auth.onAuthorizeSuccess,  // *optional* callback on success - read more below
  fail:         auth.onAuthorizeFail,     // *optional* callback on fail/error - read more below
}));

var app = express();
app.use(cookieParser());
authauth
heartBeat();

var routes = require('./config/routes.js')(app, io);

io.listen(3000);
console.log('Game server started...');