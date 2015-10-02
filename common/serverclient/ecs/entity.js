(function(exports){
   exports.ECS = exports.ECS || {};
   exports.ECS.Entity = (function(){
    function Entity() {
    	this.id = (+new Date()).toString(16) + 
    	(Math.random() * 100000000 | 0).toString(16) +
    	Entity.prototype._count;

    	Entity.prototype._count++;
    	this.components = {};


        console.log("Entity created.");
        return this;
    }	

    Entity.prototype._count = 0;
    Entity.prototype.addComponent = function ( component ){
    	this.components[component.name] = component;
    	return this;
    }
    Entity.prototype.removeComponent = function ( component ){
    	delete this.components[component.name];
    }
    Entity.prototype.print = function() {
    	console.log(JSON.stringify(this));
    }
    
    return Entity;
    })();
// Export in such a way that it can be shared between server and client.                       
}) (typeof exports === 'undefined'? this : module.exports);