var _ = require('underscore');
module.exports = function(settings){
	console.log(settings);
	_.each(settings, function(setting){
		var env = process.env[setting];
		console.log(env);
		if (!env) throw new Error("please set the " + setting + " environmental variable");
	})
};