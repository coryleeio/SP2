var canvas = require('../../canvas');
var gameConstants = require('../../config/gameConstants');
var scene = canvas.scene;
var Drawable = require('../components/drawable');
var Transform = require('../components/transform');
var DrawableTypeFactory = require('../factories/drawableTypeFactory');

function DrawingSystem() {
	this.spriteByEntityId = {};
	this.componentTypes = [Drawable.name, Transform.name];
}

DrawingSystem.prototype.update = function(entities, delta) {
	entities.forEach(function(entity){
		var sprite = this.spriteByEntityId[entity.id];
		var rigidBody = entity.components.rigidBody;
		var transform = entity.components.transform;

		var desiredPositionX = transform.position.x;
		var desiredPositionY = transform.position.y;

		// TODO: Iterpolate mesh to position of transform at appropriate delay.
		//sprite.position.x = (sprite.position.x + (transform.position.x - sprite.position.x)) / gameConstants.numberOfTimesPerFrameToInterpolate ;
		//sprite.position.y = (sprite.position.y + (transform.position.y - sprite.position.y)) / gameConstants.numberOfTimesPerFrameToInterpolate ;
		var newPosition = BABYLON.Vector3.Lerp(sprite.position, transform.position, delta)
		sprite.position.x = newPosition.x;
		sprite.position.y = newPosition.y;
		sprite.angle = sprite.angle + (transform.angle - sprite.angle) * delta;
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