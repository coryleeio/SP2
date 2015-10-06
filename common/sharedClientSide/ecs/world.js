var gameTemplates = require('./templates');
var utilities = require('./utilities');
var nextEntityId = 1;

var World = function() {
    this.templates = gameTemplates; 
    this.entitiesByCompoundKey = {};
    this.stepSystemsByConstructor = {}; // systems that have a step method.
    this.updateSystemsByConstructor = {}; // systems that have an update method.
    this.registrationSystemsByCompoundKey = {};
}

// Increment the simulation by delta MS
World.prototype.step = function(delta){
    for(var systemConstructor in this.stepSystemsByConstructor){
        var system = this.stepSystemsByConstructor[systemConstructor];
        var entities = this.entitiesByCompoundKey[system.compoundKey];
        for(var entityIndex in entities) {
            system.step(entities[entityIndex]);
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
            system.update(entities[entityIndex]);
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
}

World.prototype.registerSystem = function(system) {
    if (system.componentTypes.length <1 ) {
        throw 'Tried to register service ' + system.constructor + ' without any componentTypes'; 
    }
    console.log("registering service: " + system.constructor);

    var compoundKey = utilities.calculateCompoundKey(system.componentTypes);
    system.compoundKey = compoundKey;

    if(typeof(system.step) == "function") {
        console.log("registered " + system.constructor + " as a step system.");
        this.stepSystemsByConstructor[system.constructor] = this.stepSystemsByConstructor[system.constructor] || [];
        this.stepSystemsByConstructor[system.constructor].push(system);
    }
    if(typeof(system.update) == "function") {
        console.log("registered " + system.constructor + " as a update system.");
        this.updateSystemsByConstructor[system.constructor] = this.updateSystemsByConstructor[system.constructor] || [];
        this.updateSystemsByConstructor[system.constructor].push(system);
    }

    if(typeof(system.onRegister) == "function") {
        console.log("registered " + system.constructor + " as a onRegister system.");
        this.registrationSystemsByCompoundKey[compoundKey] = this.registrationSystemsByCompoundKey[compoundKey] || [];
        this.registrationSystemsByCompoundKey[compoundKey].push(system);

        var relevantEntities = this.entitiesByCompoundKey[compoundKey];
        for(var entityIndex in relevantEntities) {
            system.onRegister(relevantEntities[entityIndex]);
        }
    }
}

World.prototype.deserializeState = function(input) {
    console.log("deserializeState not implemented");
}

module.exports = World;