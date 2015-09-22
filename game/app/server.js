var http = require('http');
var express = require('express');
var io = require('socket.io')();
var cookieParser = require('cookie-parser')
var heartBeat = require('./heartbeat.js');
var auth      = require('./config/auth');
var mandatory = require('./common/config/force-env') // No semicolon.
(['LOGIN_SERVER_HOST','LOGIN_SERVER_PORT','SHARED_SERVER_SECRET','HOST','PORT']);

var host = process.env.HOST;
var port = process.env.PORT;
var LOGIN_SERVER_HOST = process.env.LOGIN_SERVER_HOST;
var LOGIN_SERVER_PORT = process.env.LOGIN_SERVER_PORT;

var app = express();
app.use(cookieParser());

heartBeat();

var routes = require('./app/routes.js')(app, io);

io.listen(3000);
console.log('Game server started...');