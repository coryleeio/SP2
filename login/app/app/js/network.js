var scene = require('./_sharedClientSide/canvas').scene;
var World     = require('./_sharedClientSide/ecs/world');
var DrawingSystem = require('./_sharedClientSide/ecs/systems/drawingSystem');
var PhysicsSystem = require('./_sharedClientSide/ecs/systems/physicsSystem');
var gameloop = require('./clientGameLoop');

// build world, register systems.
var world = new World();
var drawingSystem = new DrawingSystem();
var physicsSystem = new PhysicsSystem(Matter);
world.registerSystem(drawingSystem);	
world.registerSystem(physicsSystem);

var network = {
	connectToGameServer: function(gameUrl) {
		console.log("Connecting to game server at: " + gameUrl);
		var socket = io( gameUrl );
		socket.on('connect', function () {
			console.log("Connected to server.");
			scene.registerBeforeRender(function() {
				// start main game loop here.
				gameloop(world);
			});
		});

		socket.on('takeControl', function(entityId) {
			console.log('taking control of entity: ', entityId);
		});

		socket.on('snapshot', function(data) {
			world.receiveSnapshot(world, data);
		});

		socket.on('disconnect', function() {
			console.log("Disconnected from server.");
		});
	}
};
module.exports = network;