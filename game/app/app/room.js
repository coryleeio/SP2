var serverConstants = require('../config/serverConstants');
var gameLoop = require('./gameloop');

// Code shared with client.
var World     = require('./_sharedClientSide/ecs/world');
var gameConstants = require('./_sharedClientSide/config/gameConstants');

function Room(id) {
	this.players = [];
	this.id = id;
	this.maxPlayers = serverConstants.playersPerRoom;
	console.log("Room " + this.id + " - started with with (" + this.players.length + " / " + this.maxPlayers + ")" );

	this.world = new World();
	loopId = gameLoop.setGameLoop(this.world.step, gameConstants.stepDelta);
}

module.exports = Room