var requestPromise = require('request-promise');
var cronJob = require("cron").CronJob;
var gameConfig = require('./config/game_server_config.js');
var loginConfig = require('./config/login_server_config.js');

module.exports = function(){
	var heartBeat = {
		host: gameConfig.host,
		port: gameConfig.port,
		load: 0.0,
		server_shared_secret: gameConfig.shared_server_secret
	};

	console.log("sending heartbeat: " + heartBeat.port);

	var options = {
	    uri : 'http://' + loginConfig.host + ':' + loginConfig.port + '/server',
	    method : 'PUT',
	    json: heartBeat
	};

	new cronJob("*/2 * * * * *", function() {
	    requestPromise(options)
	        .then(console.log('ran hearbeat successfully!'))
	        .catch(console.error);
	}, null, true);
};