var canvas = require('../../canvas');
var drawableName = require('../components/drawable').name;

function DrawingSystem() {
	this.hasDrawnById = {};
	this.componentTypes = [drawableName];
}

DrawingSystem.prototype.onRegister = function(entity) {
	this[entity.components.drawable.fn](); // call the function on myself to draw the thing requested.
	this.hasDrawnById[entity.id] = entity;
}

// demo
DrawingSystem.prototype.sphere = function() {
	console.log('drawing the sphere!!');
}


module.exports = DrawingSystem;