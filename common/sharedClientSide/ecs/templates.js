var Entity = require('./entity');
var drawableImport = require('./components/drawable');
var Drawable = drawableImport.constructor;
var drawableName = drawableImport.name

var physicsBodyImport = require('./components/physicsBody');
var PhysicsBody = physicsBodyImport.constructor;
var physicsBodyName = physicsBodyImport.name;

var templates = {
	ball: function(id) {
		var entity = new Entity(id);
		console.log(Drawable);
		entity.addComponent(new Drawable('sphere'), drawableName);
		entity.addComponent(new PhysicsBody(), physicsBodyName);
		return entity;
	}
};

module.exports = templates;