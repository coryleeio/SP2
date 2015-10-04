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

// Increment the simulation by delta MS
World.prototype.step = function(delta){
	console.log('step' + delta);
} 

// Client side only, visual fidelity updates, 
// things that do not effect the simulation
// such as: interpolate positions toward desired positions
// not run by server at all.
World.prototype.update = function(delta) {
	console.log('update ');
}

World.prototype.createEntityFromTemplate = function(templateName) {
    var entity = this.templates[templateName]();
    return entity;
}

module.exports = World;