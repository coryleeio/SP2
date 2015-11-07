var utilities = require('./utilities');
var nextEntityId = 1;

var World = function() {
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
}

World.prototype.deregisterEntityById = function(entityId) {
    console.log('deregistering', entityId);
    var localEntity = this.entitiesById[entityId];

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
    delete this.entitiesById[entityId]; // dont replace this with localEntity
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
    return this.entitiesById;
}

World.prototype.receiveSnapshot = function(world, inputEntitiesById) {
    for(var id in inputEntitiesById) {
        var foreignEntity = inputEntitiesById[id];
        var localEntity = world.entitiesById[id];
        if(localEntity == null) {
            // Handle creation here
            world.registerEntity(foreignEntity);
        }
        else{
            // Handle update here
            for(var componentKey in foreignEntity.components){
                if(componentKey != "playerInput"){
                    localEntity.components[componentKey] = foreignEntity.components[componentKey];
                }
            }
        }
    }

    for(var id in world.entitiesById) {
        var foreignEntity = inputEntitiesById[id];
        if(foreignEntity == null) {
            // Handle delete here
            world.deregisterEntityById(id);
        }
    }
}

module.exports = World;