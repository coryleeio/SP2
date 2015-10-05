var gameTemplates = require('./templates');
var nextEntityId = 1;

var World = function() {
    this.templates = gameTemplates; // This will not send over the wire.
    // dont freak out if you dont see it when desyncing.
    // remember JSON stringify does not print functions also....
    
    this.entities = {};
    this.systemsByInterest = {};
    this.entitiesByComponentType = {};
}

// Increment the simulation by delta MS
World.prototype.step = function(delta){
	for(var interest in this.systemsByInterest) {
        var systems = this.systemsByInterest[interest];
        for(systemIndex in systems) {
            var system = systems[systemIndex];
            console.log("system: " + system);
            if(typeof(system.step) === 'function'){
                system.step(this.entitiesByComponentType[interest], delta);
            }
        }
    }
} 

// Client side only, visual fidelity updates, 
// things that do not effect the simulation
// such as: interpolate positions toward desired positions
// not run by server at all.
World.prototype.update = function(delta) {
   for(var system in this.systemsByInterest) {
        if(typeof(system.update) == 'function'){
            system.update(this.entitiesByComponentType, delta);
        }
    }
}

World.prototype.createEntityFromTemplate = function(templateName) {
    var entity = this.templates[templateName](nextEntityId);
    nextEntityId++;
    this.registerEntity(entity);
    console.log("create entity from template: " + templateName);
    return entity;
}

World.prototype.registerEntity = function(entity) {
    this.entities[entity.id] = entity;
    for(var componentType in entity.components) {
        this.entitiesByComponentType[componentType] = this.entitiesByComponentType[componentType] || [];
        this.entitiesByComponentType[componentType].push(entity);
    }
}

World.prototype.registerSystem = function(system) {
    for(var index in system.interests) {
        var interest = system.interests[index];
        this.systemsByInterest[interest] = this.systemsByInterest[interest] || [];
        this.systemsByInterest[interest].push(system);
    }
}

World.prototype.deserializeState = function(input) {
    console.log("deserializeState not implemented");
}

module.exports = World;