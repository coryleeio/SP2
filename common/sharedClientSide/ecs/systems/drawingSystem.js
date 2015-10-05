var canvas = require('../../canvas');
var interest = require('../components/drawable').name;

function DrawingSystem() {
	this.hasDrawnById = {};
	this.interests = [interest];
}

DrawingSystem.prototype.step = function(entities, delta) {
	for(var entityIndex in entities) {
		var entity = entities[entityIndex];
		if(this.hasDrawnById[entity.id] == null) {
			this[entity.components.drawable.fn]();
			this.hasDrawnById[entity.id] = entity;
		}
	}
}

DrawingSystem.prototype.sphere = function() {
	console.log('drawing the sphere!!');
}


module.exports = DrawingSystem;