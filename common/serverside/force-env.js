var _ = require('underscore');
module.exports = function(settings){
	_.each(settings, function(setting){
		var env = process.env[setting];
		if (!env) throw new Error("please set the " + setting + " environmental variable");
	})
};