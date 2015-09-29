
var cookie = require('cookie');
var auth   = require('../app/auth')

module.exports = function(app, io) {

	io.on('connection', function(socket){
	  if(socket.request.user.logged_in) {
	  	console.log('User: ' + socket.request.user.google.email + ' has connected.');
	  }
	  else {
	  	console.log('An anonymous user has connected.');
	  }
	  socket.on('disconnect', function(){
	  	if(socket.request.user != null && socket.request.user.google != null)
	  	{
	  		console.log('User: ' + socket.request.user.google.email + ' has disconnected.');
	  	}
	  	else
	  	{
	  		console.log('An anonymous user has disconnected');
	  	}

	  });
	});
};

