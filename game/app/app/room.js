var serverConstants = require('../config/serverConstants');
var gameLoop = require('./serverGameLoop');
var World     = require('./_sharedClientSide/ecs/world');
var PhysicsSystem = require('./_sharedClientSide/ecs/systems/physicsSystem');
var gameConstants = require('./_sharedClientSide/config/gameConstants');
var Matter = require('./_sharedClientSide/matter.js');

var Ball = require('./_sharedClientSide/ecs/templates/ball');

function Room(io, id) {
	var createdRoom = this;
	this.id = id;
	this.io = io;
	this.players = [];
	this.maxPlayers = serverConstants.playersPerRoom;
	this.print();

	this.world = new World();
	var physicsSystem = new PhysicsSystem(Matter);
	this.world.registerSystem(physicsSystem);

	this.world.registerEntity(new Ball({x: -2, y: 0}, 2));
	this.world.registerEntity(new Ball({x: 0, y: 0}, 1));
	this.world.registerEntity(new Ball({x: 2, y: 0}, 2));
	this.world.registerEntity(new Ball({x: 4, y: -2}, 2));
	this.world.registerEntity(new Ball({x: -4, y: -2}, 2));
	this.world.registerEntity(new Ball({x: 2, y: -4}, 2));

	var fn = this.world.step.bind(this.world);
	loopId = gameLoop.setGameLoop(fn, gameConstants.stepDelta);
	gameLoop.setGameLoop(function(){
	   createdRoom.io.sockets.in(createdRoom.id).emit('snapshot', createdRoom.world.getSnapshot());
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