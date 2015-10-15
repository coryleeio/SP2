var utilities = require('./utilities');
var nextEntityId = 1;

var World = function() {
    this.entities = [];
    this.entitiesById = {};
    this.entitiesByCompoundKey = {};

    this.stepSystemsByConstructorName = {}; // systems that have a step method.
    this.updateSystemsByConstructorName = {}; // systems that have an update method.
    this.registrationSystemsByCompoundKey = {};
    this.deregistrationSystemsByCompoundKey = {};
}

// Increment the simulation by delta MS
World.prototype.step = function(delta){
    for(var systemConstructor in this.stepSystemsByConstructorName){
        var system = this.stepSystemsByConstructorName[systemConstructor];
        var entities = this.entitiesByCompoundKey[system.compoundKey];
        if(entities) {
            system.step(entities, delta);
        }
    }
} 

// Client side only, visual fidelity updates, 
// things that do not effect the simulation
// such as: interpolate positions toward desired positions.
// This is not run by the server at all.
World.prototype.update = function(delta) {
    for(var systemConstructor in this.updateSystemsByConstructorName){
        var system = this.updateSystemsByConstructorName[systemConstructor];
        var entities = this.entitiesByCompoundKey[system.compoundKey];
        if(entities) {
            system.update(entities, delta);
        }
    }
}

World.prototype.registerEntity = function(entity) {
    if(entity.id == null) {
        entity.id = nextEntityId;
        nextEntityId++;
    }

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
    var systemKey = utilities.lowerCaseFirstLetter(system.constructor.name);
    system.compoundKey = compoundKey;

    if(typeof(system.step) == "function") {
        console.log("Registered " + systemKey + " to handle steps for entities with the following compound key: " + compoundKey);
        this.stepSystemsByConstructorName[systemKey] = system;
    }
    
    if(typeof(system.update) == "function") {
        console.log("Registered " + systemKey + " to handle updates for entities with the following compound key: " + compoundKey);
        this.updateSystemsByConstructorName[systemKey] = system;
    }

    if(typeof(system.onRegister) == "function") {
        console.log("Registered " + systemKey + " to handle registration for entities with the following compound key: " + compoundKey);
        this.registrationSystemsByCompoundKey[compoundKey] = this.registrationSystemsByCompoundKey[compoundKey] || [];
        this.registrationSystemsByCompoundKey[compoundKey].push(system);

        var relevantEntities = this.entitiesByCompoundKey[compoundKey];
        for(var entityIndex in relevantEntities) {
            system.onRegister(relevantEntities[entityIndex]);
        }
    }

    if(typeof(system.onDeregister) == "function") {
        console.log("Registered " + systemKey + " to handle deregistration for entities with the following compound key: " + compoundKey);
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