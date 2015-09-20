var http = require('http');
var express = require('express');
var cookieParser = require('cookie-parser')
var heartBeat = require('./heartbeat.js');
var mandatory = require('./common/config/force-env') // No semicolon.
var auth      = require('./config/auth');
(['LOGIN_SERVER_HOST','LOGIN_SERVER_PORT','SHARED_SERVER_SECRET','HOST','PORT']);

var host = process.env.HOST;
var port = process.env.PORT;
var LOGIN_SERVER_HOST = process.env.LOGIN_SERVER_HOST;
var LOGIN_SERVER_PORT = process.env.LOGIN_SERVER_PORT;

var app = express();
app.use(cookieParser());

app.get('/', function (req, res) {
	var loginToken = req.cookies.loginToken;
	if(!auth.validateLoginToken(loginToken))
	{
		console.log('user token not valid redirecting to login server.');
		return res.redirect('http://' + LOGIN_SERVER_HOST + ':' + LOGIN_SERVER_PORT);
	}
	res.send("Game Server!");
})

heartBeat();

var server = app.listen(3000);
console.log('Game server started...');