var auth   = require('./auth');
var Room   = require('./room');
var _      = require('underscore');
var serverConstants = require('../config/serverConstants');


module.exports = function(app, io) {
  var rooms = {};
  _.each(_.range(serverConstants.roomsPerServer), function(id)  {
    rooms[id] = new Room(id);
  });
  
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