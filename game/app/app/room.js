var serverConstants = require('../config/serverConstants');
var gameLoop = require('./serverGameLoop');
var World     = require('./_sharedClientSide/ecs/world');
var gameConstants = require('./_sharedClientSide/config/gameConstants');
function Room(io, id) {
	var createdRoom = this;
	this.id = id;
	this.io = io;
	this.players = [];
	this.maxPlayers = serverConstants.playersPerRoom;
	this.print();

	this.world = new World();
	this.world.createEntityFromTemplate('ball');


	loopId = gameLoop.setGameLoop.bind(this.world, this.world.step, gameConstants.stepDelta);
	gameLoop.setGameLoop(function(){
	   createdRoom.io.sockets.in(createdRoom.id).emit('snapshot', createdRoom.world.entities);
	 }, gameConstants.snapshotDelta);
}

Room.prototype.join = function(client) {
	console.log("client.id: " + client.id + " joining room with id: " + this.id);
	this.players.push(client);
	client.join(this.id); // socket io join room
	this.print();
}

Room.prototype.leave = function(client) {
	console.log("client.id: " + client.id + " leaving room with id: " + this.id);
	var index = this.players.indexOf(client);
	this.players.splice(index, 1);
	this.print();
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