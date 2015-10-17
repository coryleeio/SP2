
var gameLoop = require('./serverGameLoop');
var World     = require('./_sharedClientSide/ecs/world');
var PhysicsSystem = require('./_sharedClientSide/ecs/systems/physicsSystem');
var gameConstants = require('./_sharedClientSide/config/gameConstants');
var Matter = require('./_sharedClientSide/matter.js');
var Vespa = require('./_sharedClientSide/ecs/templates/vespa');

// Serverside game logic

function Game(io, room) {
	this.room = room;
	this.io = io;
	this.world = new World();
	var physicsSystem = new PhysicsSystem(Matter);
	this.world.registerSystem(physicsSystem);
}

Game.prototype.spawnPlayer = function(client){
	var ship = new Vespa({x: 0, y: 0});
	this.world.registerEntity(ship);
	this.io.to(client.id).emit('takeControl', ship.id);
}

Game.prototype.start = function() {
	var fn = this.world.step.bind(this.world);
	this.gameLoopId = gameLoop.setGameLoop(fn, gameConstants.stepDelta);
	this.snapshotLoopId = gameLoop.setGameLoop(function(){
	   this.io.sockets.in(this.room.id).emit('snapshot', this.world.getSnapshot());
	 }.bind(this), gameConstants.snapshotDelta);
}

Game.prototype.stop = function() {
	gameLoop.clearGameLoop(this.gameLoopId);
	gameLoop.clearGameLoop(this.snapshotLoopId);
	this.gameLoopId = null;
	this.snapshotLoopId = null;
}

module.exports = Game;