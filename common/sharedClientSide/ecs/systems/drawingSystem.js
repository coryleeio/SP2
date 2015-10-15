var canvas = require('../../canvas');
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

		// TODO: Iterpolate mesh to position of transform at appropriate delay.
		sprite.position.x = transform.position.x;
		sprite.position.y = transform.position.y;
		sprite.angle = transform.angle;
	}, this);
}

DrawingSystem.prototype.onRegister = function(entity) {
	var sprite = DrawableTypeFactory[entity.components.drawable.drawableType](entity);
	console.log('drawing: ' + JSON.stringify(entity));
	this.spriteByEntityId[entity.id] = sprite;
}

DrawingSystem.prototype.onDeregister = function(entity) {
	this.spriteByEntityId[entity.id].dispose();
	this.spriteByEntityId[entity.id] = null;
}

module.exports = DrawingSystem;