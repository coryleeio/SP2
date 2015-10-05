var scene = require('./_sharedClientSide/canvas').scene;
var World     = require('./_sharedClientSide/ecs/world');
var DrawingSystem = require('./_sharedClientSide/ecs/systems/drawingSystem');
var gameloop = require('./clientGameLoop');

var network = {
	connectToGameServer: function(gameUrl) {
		console.log("Connecting to game server at: " + gameUrl);
		var socket = io( gameUrl );
		socket.on('connect', function () {
			console.log("Connected to server.");
			var world = new World();

			var drawingSystem = new DrawingSystem();
			world.registerSystem(drawingSystem);			
			world.createEntityFromTemplate('ball');

			scene.registerBeforeRender(function() {
				gameloop(world);
			});
		});

		socket.on('snapshot', function(data) {
			console.log('snapshot received: ' + JSON.stringify(data));
		});

		socket.on('disconnect', function() {
			console.log("Disconnected from server.");
		});
	}
};
module.exports = network;