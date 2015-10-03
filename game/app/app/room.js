var serverConstants = require('../config/serverConstants');
var gameLoop = require('./_sharedClientSide/gameloop');

// Code shared with client.
var World     = require('./_sharedClientSide/ecs/world');
var gameConstants = require('./_sharedClientSide/config/gameConstants');

function Room(id) {
	this.players = [];
	this.id = id;
	this.maxPlayers = serverConstants.playersPerRoom;
	console.log("Start room id: " + this.id + " with (" + this.players.length + " / " + this.maxPlayers + ")" );

	this.world = new World();
	gameLoop.setGameLoop(this.world.step, gameConstants.stepDelta);
}
module.exports = Room