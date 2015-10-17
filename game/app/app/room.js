var serverConstants = require('../config/serverConstants');
var Game = require('./game');

function Room(io, id) {
	var createdRoom = this;
	this.id = id;
	this.io = io;
	this.players = [];
	this.game = new Game(io, this);
	this.maxPlayers = serverConstants.playersPerRoom;
	this.print();
}

Room.prototype.join = function(client) {
	console.log("client.id: " + client.id + " joining room with id: " + this.id);
	this.players.push(client);
	client.join(this.id); // socket io join room
	this.game.spawnPlayer(client);
	if(this.players.length == 1) {
		this.game.start();
	}
}

Room.prototype.leave = function(client) {
	console.log("client.id: " + client.id + " leaving room with id: " + this.id);
	var index = this.players.indexOf(client);
	this.players.splice(index, 1);
	if(this.players.length == 0) {
		this.game.stop();
	}
}

Room.prototype.hasRoomFor = function(spaceWanted) {
	return this.getPlayerCount() + spaceWanted < this.maxPlayers;
}

Room.prototype.getPlayerCount = function() {
	return this.players.length;
}

Room.prototype.getPlayers = function() {
	return this.players;
}

Room.prototype.print = function() {
	console.log("Room " + this.id + " - now has (" + this.getPlayerCount() + " / " + this.maxPlayers + ") players." );
}

module.exports = Room