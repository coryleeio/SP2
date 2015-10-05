var _      = require('underscore');
module.exports = {
	findRoom: function(client, rooms) {
		return _.filter(rooms, function(room)  {
		  if(room.hasRoomFor(1)) {
		  	return room;
		  }
		})[0];
	}
}