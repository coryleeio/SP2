var canvas = require('../../canvas');
var scene = canvas.scene;
var Drawable = require('../components/drawable');
var Transform = require('../components/transform');
var vespa = new BABYLON.SpriteManager("VespaMgr", "assets/vespa.png", 20, 512, scene);

function DrawingSystem() {
	this.spriteManagerBySpriteName = {
		vespa: vespa
	};
	this.spriteByEntityId = {};
	this.componentTypes = [Drawable.name, Transform.name];
}

DrawingSystem.prototype.update = function(entities, delta) {
	entities.forEach(function(entity){
		var sprite = this.spriteByEntityId[entity.id];
		var rigidBody = entity.components.rigidBody;
		var transform = entity.components.transform;

		// TODO: iterpolate mesh to position of transform at appropriate delay.
		sprite.position.x = transform.position.x;
		sprite.position.y = transform.position.y;
		sprite.angle = transform.angle;
	}, this);
}

DrawingSystem.prototype.onRegister = function(entity) {
	var spriteManager = this.spriteManagerBySpriteName[entity.components.drawable.spriteName]; 
	var sprite = new BABYLON.Sprite(entity.id + ' - sprite', spriteManager);
	this.spriteByEntityId[entity.id] = sprite;
}

DrawingSystem.prototype.onDeregister = function(entity) {
	this.spriteByEntityId[entity.id].dispose();
	this.spriteByEntityId[entity.id] = null;
}

module.exports = DrawingSystem;