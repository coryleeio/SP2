
var gameLoop = require('./serverGameLoop');
var World     = require('./_sharedClientSide/ecs/world');
var PhysicsSystem = require('./_sharedClientSide/ecs/systems/physicsSystem');
var gameConstants = require('./_sharedClientSide/config/gameConstants');
var Matter = require('./_sharedClientSide/matter.js');

var Ball = require('./_sharedClientSide/ecs/templates/ball');

// Serverside game logic

function Game(io, room) {
	this.room = room;
	this.io = io;
	this.world = new World();
	var physicsSystem = new PhysicsSystem(Matter);
	this.world.registerSystem(physicsSystem);

	
	// this.world.registerEntity(new Ball({x: -2, y: 0}, 2));
	// this.world.registerEntity(new Ball({x: 0, y: 0}, 1));
	// this.world.registerEntity(new Ball({x: 2, y: 0}, 2));
	// this.world.registerEntity(new Ball({x: 4, y: -2}, 2));
	// this.world.registerEntity(new Ball({x: -4, y: -2}, 2));
	// this.world.registerEntity(new Ball({x: 2, y: -4}, 2));
}

Game.prototype.start = function() {
	var fn = this.world.step.bind(this.world);
	this.gameLoopId = gameLoop.setGameLoop(fn, gameConstants.stepDelta);
	this.snapshotLoopId = gameLoop.setGameLoop(function(){
	   this.io.sockets.in(this.id).emit('snapshot', this.world.getSnapshot());
	 }.bind(this), gameConstants.snapshotDelta);
	this.spawnLoopId = gameLoop.setGameLoop(this.spawnPlayersIfNeeded, gameConstants.playerSpawnRate);
}

Game.prototype.spawnPlayersIfNeeded = function() {
	this.room.players.forEach(client) {

	}
}

Game.prototype.stop = function() {
	gameLoop.clearGameLoop(this.gameLoopId);
	gameLoop.clearGameLoop(this.snapshotLoopId);
	this.gameLoopId = null;
	this.snapshotLoopId = null;
}

module.exports = Game;