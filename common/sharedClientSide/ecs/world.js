var Ball = require('./templates/ball');

function World() {
    console.log("World created.");
    this.templates = {};

    // register templates here.
    this.templates[Ball.templateName] = Ball;
    return this;
}

World.prototype.step = function(delta){

} 

World.prototype.createEntityFromTemplate = function(templateName) {
    var Template = this.templates[templateName];
    return new Template();
}

module.exports = World;