var canvas = require('../../canvas');
var gameConstants = require('../../config/gameConstants');
var scene = canvas.scene;
var camera = canvas.camera;
var Drawable = require('../components/drawable');
var Transform = require('../components/transform');
var DrawableTypeFactory = require('../factories/drawableTypeFactory');

function DrawingSystem(playerInputSystem) {
	this.spriteByEntityId = {};
	this.componentTypes = [Drawable.name, Transform.name];
	this.playerInputSystem = playerInputSystem;
}

DrawingSystem.prototype.update = function(entities, delta) {
	entities.forEach(function(entity){
		var sprite = this.spriteByEntityId[entity.id];
		var rigidBody = entity.components.rigidBody;
		var transform = entity.components.transform;

		var desiredPositionX = transform.position.x;
		var desiredPositionY = transform.position.y;

		var newPosition = BABYLON.Vector3.Lerp(sprite.position, transform.position, delta);
		sprite.position.x = newPosition.x;
		sprite.position.y = newPosition.y;
		sprite.angle = sprite.angle + (transform.angle - sprite.angle) * delta;
		if(this.playerInputSystem.playerControlledEntityId != null && this.playerInputSystem.playerControlledEntityId == entity.id) {
			console.log("Focusing camera...");
			var newCameraPosition = {x: desiredPositionX, y: desiredPositionY, z: camera.position.z};
			newCameraPosition = BABYLON.Vector3.Lerp(camera.position, newCameraPosition, delta);
			camera.position = newCameraPosition;
		}
	}, this);
}

DrawingSystem.prototype.onRegister = function(entity) {
	var sprite = DrawableTypeFactory[entity.components.drawable.drawableType](entity);
	this.spriteByEntityId[entity.id] = sprite;
}

DrawingSystem.prototype.onDeregister = function(entity) {
	this.spriteByEntityId[entity.id].dispose();
	this.spriteByEntityId[entity.id] = null;
}

module.exports = DrawingSystem;