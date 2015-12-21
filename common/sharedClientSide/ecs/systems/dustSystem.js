var canvas = require('../../canvas');
var gameConstants = require('../../config/gameConstants');
// Create a sprite manager

var scene = canvas.scene;

function DustSystem() {
	console.log("Created Dust System");
	this.minX = gameConstants.starFieldPosXMinimum;
	this.maxX = gameConstants.starFieldPosXMaximum;
	this.minY = gameConstants.starFieldPosYMinimum;
	this.maxY = gameConstants.starFieldPosYMaximum;
	this.minZ = gameConstants.starFieldPosZMinimum;
	this.maxZ = gameConstants.starFieldPosZMaximum;

	var generateRandomNumber = function(min, max) {
	    var num = Math.random() * (max - min) + min;
	        return num;
	};
	var dustParticleManager = new BABYLON.SpriteManager("dustParticleManager", "Assets/dustParticleTexture.png", gameConstants.numberOfDustParticles, 128, scene);
	console.log("out of loop");
	for(var i =0; i < gameConstants.numberOfDustParticles; i++) {
		console.log("in loop");
		var particle = new BABYLON.Sprite("particle", dustParticleManager);
		var x =  generateRandomNumber(this.minX, this.maxX);
		var y = generateRandomNumber(this.minY, this.maxY);
		var z = generateRandomNumber(this.minZ, this.maxZ);
		console.log("Generating particle at: " + x + " " + y);
		particle.position.x =x;
		particle.position.y =y;
		particle.position.z =z;
		particle.size = gameConstants.dustSize;
	}
}

module.exports = DustSystem;