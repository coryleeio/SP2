
// The lifecycle of these should be managed via world, do not add components directly.


function Entity(id) {
	this.id = id;
	this.components = {};
    return this;
}	

Entity.prototype.addComponent = function ( component, componentName ){
	this.components[componentName] = component;
	return this;
}
Entity.prototype.removeComponent = function ( componentName ){
	delete this.components[componentName];
}

module.exports = Entity;