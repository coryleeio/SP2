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

World.prototype.step = function(delta){
} 

World.prototype.createEntityFromTemplate = function(templateName) {
    var entity = this.templates[templateName]();
    return entity;
}

module.exports = World;