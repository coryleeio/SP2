var serverConstants = require('../config/serverConstants');
var gameLoop = require('./gameloop');

// Code shared with client.
var World     = require('../_common/serverclient/ecs/world').ECS.World;
var gameConstants = require('../_common/serverclient/config/gameConstants').ECS.gameConstants;

function Room(id) {
	this.players = [];
	this.id = id;
	this.maxPlayers = serverConstants.playersPerRoom;
	console.log("Start room id: " + this.id + " with (" + this.players.length + " / " + this.maxPlayers + ")" );

	this.world = new World();
	gameLoop.setGameLoop(this.world.step, gameConstants.stepDelta);
}
module.exports = Room