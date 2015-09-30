function connectToGameServer(gameUrl) {
	console.log("Connecting to game server at: " + gameUrl);
	var socket = io( gameUrl );
	socket.on('news', function (data) {
		console.log(data);
	});

	var sphere = new BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
	sphere.position.y = 1;
	var ground = new BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);
}