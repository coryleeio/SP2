if(BABYLON) {
	canvas = document.getElementById('renderCanvas');
	engine = new BABYLON.Engine(canvas, true);
	scene = new BABYLON.Scene(engine);

	var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 0,-10), scene);
	camera.setTarget(BABYLON.Vector3.Zero());
	camera.attachControl(canvas, false);
	var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

	// run the render loop
	engine.runRenderLoop(function(){
	    scene.render();
	});

	// the canvas/window resize event handler
	window.addEventListener('resize', function(){
	    engine.resize();
	});
}

module.exports.canvas = canvas; // null serverside
module.exports.engine = engine; // null serverside
module.exports.scene = scene;   // null serverside