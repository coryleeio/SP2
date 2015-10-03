var Entity = require('./entity');
var templates = {
	ball: function() {
		var entity = new Entity();
		return entity;
	}
};

module.exports = templates;