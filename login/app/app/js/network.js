var scene = require('./_sharedClientSide/canvas').scene;
var World     = require('./_sharedClientSide/ecs/world');
var gameloop = require('./clientGameLoop');

var network = {
	connectToGameServer: function(gameUrl) {
		console.log("Connecting to game server at: " + gameUrl);
		var socket = io( gameUrl );
		socket.on('connect', function () {
			console.log("Connected to server.");
			var world = new World();
			var sphere = new BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
			sphere.position.y = 1;
			var ground = new BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);

			scene.registerBeforeRender(function() {
				gameloop(world);
			});






			
		});

		socket.on('disconnect', function() {
			console.log("Disconnected from server.");
		});
	}
};
module.exports = network;