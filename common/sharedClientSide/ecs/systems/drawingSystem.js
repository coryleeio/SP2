var canvas = require('../../canvas');
var drawableName = require('../components/drawable').name;

function DrawingSystem() {
	this.meshByEntityId = {};
	this.componentTypes = [drawableName];
}

DrawingSystem.prototype.onRegister = function(entity) {
	var mesh = this[entity.components.drawable.fn](); // call the function on myself to draw the thing requested.
	this.meshByEntityId[entity.id] = mesh;
}

DrawingSystem.prototype.onDeregister = function(entity) {
	this.meshByEntityId[entity.id].dispose();
	this.meshByEntityId[entity.id] = null;
}

// demo
DrawingSystem.prototype.sphere = function() {
	var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
	return sphere;
}


module.exports = DrawingSystem;