var templates = require('./templates');

function World() {
    console.log("World created.");
    this.templates = {};

    for(var template in templates){
        this.templates[template] = templates[template];
    }
   	this.createEntityFromTemplate('ball');

    return this;
}

// increment the simulation by deltaMS
World.prototype.step = function(delta){
	console.log('step' + delta);
} 

// client side only, interpolate positions toward desired positions etc.
World.prototype.update = function(delta) {
	console.log('update ');
}

World.prototype.createEntityFromTemplate = function(templateName) {
    var entity = this.templates[templateName]();
    return entity;
}

module.exports = World;