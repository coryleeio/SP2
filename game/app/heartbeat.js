var requestPromise = require('request-promise');
var cronJob = require("cron").CronJob;
var gameConfig = require('./config/game_server_config.js');
var loginConfig = require('./config/login_server_config.js');
var forge = require('node-forge');
var md = forge.md.sha256.create();
md.update(gameConfig.shared_server_secret);
var digestedServerSecret = md.digest().toHex();

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
	        .then(console.log('ran hearbeat successfully!'))
	        .catch(console.error);
	}, null, true);
};