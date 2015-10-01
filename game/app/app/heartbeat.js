var requestPromise = require('request-promise');
var cronJob = require("cron").CronJob;
var gameConfig = require('../config/gameServerConfig');
var loginConfig = require('../config/loginServerConfig');
var SHA256 = require("crypto-js/sha256");
var digestedServerSecret = SHA256(gameConfig.shared_server_secret).toString();

module.exports = function(){
	var heartBeat = {
		host: gameConfig.host,
		port: gameConfig.port,
		load: 0.0,
		key: digestedServerSecret
	};

	var options = {
	    uri : 'http://' + loginConfig.host + ':' + loginConfig.port + '/server',
	    method : 'PUT',
	    json: heartBeat
	};

	new cronJob("*/2 * * * * *", function() {
	    requestPromise(options)
	        .catch(console.error);
	}, null, true);
};