var gameTemplates = require('./templates');
var utilities = require('./utilities');
var nextEntityId = 1;

var World = function() {
    this.templates = gameTemplates; 
    this.entities = [];
    this.entitiesById = {};
    this.entitiesByCompoundKey = {};

    this.stepSystemsByConstructor = {}; // systems that have a step method.
    this.updateSystemsByConstructor = {}; // systems that have an update method.
    this.registrationSystemsByCompoundKey = {};
    this.deregistrationSystemsByCompoundKey = {};
}

// Increment the simulation by delta MS
World.prototype.step = function(delta){
    for(var systemConstructor in this.stepSystemsByConstructor){
        var system = this.stepSystemsByConstructor[systemConstructor];
        var entities = this.entitiesByCompoundKey[system.compoundKey];
        for(var entityIndex in entities) {
            system.step(entities[entityIndex], delta);
        }
    }
} 

// Client side only, visual fidelity updates, 
// things that do not effect the simulation
// such as: interpolate positions toward desired positions.
// This is not run by the server at all.
World.prototype.update = function(delta) {
    for(var systemConstructor in this.updateSystemsByConstructor){
        var system = this.updateSystemsByConstructor[systemConstructor];
        var entities = this.entitiesByCompoundKey[system.compoundKey];
        for(var entityIndex in entities) {
            system.update(entities[entityIndex], delta);
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
    var compoundKeys = utilities.calculatePossibleCompoundKeys(Object.keys(entity.components));
    console.log("Registering entity with compoundKey = " + JSON.stringify(compoundKeys));
    for(var compoundKeyIndex in compoundKeys) {
        var compoundKey = compoundKeys[compoundKeyIndex];
        this.entitiesByCompoundKey[compoundKey] = this.entitiesByCompoundKey[compoundKey] || [];
        this.entitiesByCompoundKey[compoundKey].push(entity);
        var relevantRegistrationSystems = this.registrationSystemsByCompoundKey[compoundKey];
        for(registrationSystemIndex in relevantRegistrationSystems) {
            var registrationSystem = relevantRegistrationSystems[registrationSystemIndex];
            registrationSystem.onRegister(entity);
        }
    }
    this.entitiesById[entity.id] = entity;
    this.entities.push(entity);
}

World.prototype.deregisterEntity = function(entity) {
    console.log("Deregistering entity");
    var localEntity = this.entitiesById[entity.id];
    this.entitiesById[entity.id] = null;
    this.entities.splice(this.entities.indexOf(localEntity), 1);

    // This could be improved by caching possibleCompoundKeys per entityId.
    var compoundKeys = utilities.calculatePossibleCompoundKeys(Object.keys(entity.components));
    
    // This could be improved by caching the indexes of the entity, per compoundKey. 
    compoundKeys.forEach(function(key) {
        var entitiesByCompoundKey = this.entitiesByCompoundKey[key];
        entitiesByCompoundKey.splice(entitiesByCompoundKey.indexOf(localEntity), 1);
    });
}

World.prototype.registerSystem = function(system) {
    if (system.componentTypes.length <1 ) {
        throw 'Tried to register service ' + system.constructor.name + ' without any componentTypes'; 
    }


    var compoundKey = utilities.calculateCompoundKey(system.componentTypes);
    system.compoundKey = compoundKey;
    console.log("registering " + system.constructor.name + ' service with compound Key: ' + compoundKey);

    if(typeof(system.step) == "function") {
        console.log("registered " + system.constructor.name + " as a step system.");
        this.stepSystemsByConstructor[system.constructor.name] = system;
    }
    if(typeof(system.update) == "function") {
        console.log("registered " + system.constructor.name + " as a update system.");
        this.updateSystemsByConstructor[system.constructor.name] = system;
    }

    if(typeof(system.onRegister) == "function") {
        console.log("registered " + system.constructor.name + " as a onRegister system.");
        this.registrationSystemsByCompoundKey[compoundKey] = this.registrationSystemsByCompoundKey[compoundKey] || [];
        this.registrationSystemsByCompoundKey[compoundKey].push(system);

        var relevantEntities = this.entitiesByCompoundKey[compoundKey];
        for(var entityIndex in relevantEntities) {
            system.onRegister(relevantEntities[entityIndex]);
        }
    }
    if(typeof(system.onDeregister) == "function") {
        console.log("registered " + system.constructor.name + " as a onDeregister system.");
        this.deregistrationSystemsByCompoundKey[compoundKey] = this.deregistrationSystemsByCompoundKey[compoundKey] || [];
        this.deregistrationSystemsByCompoundKey[compoundKey].push(system);
        var relevantEntities = this.entitiesByCompoundKey[compoundKey];
        for(var entityIndex in relevantEntities) {
            system.onDeregister(relevantEntities[entityIndex]);
        }
    }

}

World.prototype.getSnapshot = function() {
    return this.entities;
}

World.prototype.receiveSnapshot = function(world, input) {
    input.forEach(function(entity){
        if(world.entitiesById[entity.id] == null) {
            world.registerEntity(entity);
        }

        if(entity.markedForDeletion == true) {
            world.deregisterEntity(entity);
        }
    });
}

module.exports = World;