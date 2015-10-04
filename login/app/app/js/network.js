var canvas = require('./_sharedClientSide/canvas').canvas;
var engine = require('./_sharedClientSide/canvas').engine;
var scene = require('./_sharedClientSide/canvas').scene;
var World     = require('./_sharedClientSide/ecs/world');
var stepDelta = require('./_sharedClientSide/config/gameConstants').stepDelta;

var network = {
	connectToGameServer: function(gameUrl) {
		console.log("Connecting to game server at: " + gameUrl);
		var socket = io( gameUrl );
		socket.on('connect', function () {
			console.log("Connected to server.");
			var world = new World();
			var previousTick = Date.now();
			var delta;
			var now;
			var sphere = new BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
			sphere.position.y = 1;
			var ground = new BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);

			// main loop for client side.
			scene.registerBeforeRender(function() {
				now = Date.now();
				delta = (now - previousTick) / 1000;
				if (previousTick + stepDelta <= now) {
					previousTick = now;
					world.step(delta);
				}
				world.update(delta);

			});
		});

		socket.on('disconnect', function() {
			console.log("Disconnected from server.");
		});
	}
};
module.exports = network;