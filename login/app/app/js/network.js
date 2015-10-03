var canvas = require('./canvas').canvas;
var engine = require('./canvas').engine;
var scene = require('./canvas').scene;
var gameLoop = require('./_sharedClientSide/gameloop');
var World     = require('./_sharedClientSide/ecs/world');
var gameConstants = require('./_sharedClientSide/config/gameConstants');

var network = {
	connectToGameServer: function(gameUrl) {
		console.log("Connecting to game server at: " + gameUrl);
		var socket = io( gameUrl );
		socket.on('news', function (data) {
			console.log(data);
		});

		var world = new World();
		gameLoop.setGameLoop(world.step, gameConstants.stepDelta);


		world.createEntityFromTemplate('Ball');
		// var sphere = new BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
		// sphere.position.y = 1;
		// var ground = new BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);
	}
};
module.exports = network;