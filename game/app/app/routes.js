
var cookie = require('cookie');
var auth   = require('../config/auth')

module.exports = function(app, io) {
	io.use(function(socket, next){
	  var cookies = cookie.parse(socket.handshake.headers['cookie']);
	  var loginToken = cookies.loginToken;
	  if(auth.validateLoginToken(loginToken))
	  {
	  	console.log('user token was valid.');
	  	return next();
	  }
	  console.log('user token was not valid.');
	  return next(new Error('Authentication error'));
	});

	io.on('connection', function(socket){
	  console.log('a user connected');
	  socket.on('disconnect', function(){
	    console.log('user disconnected');
	  });
	});
};

