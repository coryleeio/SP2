var http = require('http');
var express = require('express');
var cookieParser = require('cookie-parser')
var heartBeat = require('./heartbeat.js');
var mandatory = require('./common/config/force-env') // No semicolon.
(['LOGIN_SERVER_HOST','LOGIN_SERVER_PORT','SHARED_SERVER_SECRET','HOST','PORT']);

var app = express();
app.use(cookieParser());

app.get('/', function (req, res) {
	console.log(req.cookies);
	console.log(req.cookies.name);
	res.send("Game Server!");
})

heartBeat();

var server = app.listen(3000);
console.log('Game server started...');