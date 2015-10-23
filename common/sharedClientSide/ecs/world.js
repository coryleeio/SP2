var utilities = require('./utilities');
var nextEntityId = 1;

var World = function() {
    this.snapshot = {};
    this.snapshot.entities = [];
    this.snapshot.deletedThisSnapshot = [];
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
        console.log('entityID: ' + entity.id  + " assigned.");
        nextEntityId++;
    }

    var compoundKeys = utilities.calculatePossibleCompoundKeys(Object.keys(entity.components));
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
    console.log('registered entity: ' + JSON.stringify(entity));
    this.entitiesById[entity.id] = entity;
    this.snapshot.entities.push(entity);
}

World.prototype.deregisterEntityById = function(entityId) {
    console.log('deregistering', entityId);
    var localEntity = this.entitiesById[entityId];
    console.log('localEntity:', JSON.stringify(localEntity));
    this.entitiesById[entityId] = null;

    this.snapshot.entities.splice(this.snapshot.entities.indexOf(localEntity), 1);

    // This could be improved by caching possibleCompoundKeys per entityId.
    var compoundKeys = utilities.calculatePossibleCompoundKeys(Object.keys(localEntity.components));
    // This could be improved by caching the indexes of the entity, per compoundKey. 
    compoundKeys.forEach(function(key) {
        var relevantDeregistrationSystems = this.deregistrationSystemsByCompoundKey[key];
        for(registrationSystemIndex in relevantDeregistrationSystems) {
            var registrationSystem = relevantDeregistrationSystems[registrationSystemIndex];
            registrationSystem.onDeregister(localEntity);
        }
        var entitiesByCompoundKey = this.entitiesByCompoundKey[key];
        this.entitiesByCompoundKey[key].splice(this.entitiesByCompoundKey[key].indexOf(localEntity), 1);
    }.bind(this));
    this.snapshot.deletedThisSnapshot.push(localEntity.id); // If i'm the server, mark the entity for the clients to delete.
    delete localEntity;
}

World.prototype.registerSystem = function(system) {
    if (system.componentTypes.length < 1 ) {
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
    return this.snapshot;
}

World.prototype.afterSnapshot = function() {
    this.snapshot.deletedThisSnapshot = [];
}

World.prototype.receiveSnapshot = function(world, input) {
    input.entities.forEach(function(entity){
        if(world.entitiesById[entity.id] == null) {
            world.registerEntity(entity);
        }
    });

    input.deletedThisSnapshot.forEach(function(entityId){
        world.deregisterEntityById(entityId);
    });
    this.snapshot.deletedThisSnapshot = []; // things that deleted this frame.  If im not the server I dont need this.
}

module.exports = World;