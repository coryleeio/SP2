var auth = require('../config/auth.js');
var Server = require('./models/server.js');
var _ = require('underscore');

module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('index.ejs'); 
    });

    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    app.post('/login',
    passport.authenticate('local-login'), function(req, res){
        Server.find({}).sort({load: 'ascending'}).exec(function(err, servers) {
            if(servers.length == 0) {
               return res.redirect('/server_down');
            }
            var host = servers[0].host;
            var port = servers[0].port;
            var loginToken = auth.generateLoginToken(req.user.id, host, port);
            res.cookie('loginToken', loginToken, { maxAge: 1200000, httpOnly: true });
            res.cookie('gameHost', host, { maxAge: 1200000, httpOnly: true });
            res.cookie('gamePort', port, { maxAge: 1200000, httpOnly: true });
            res.send(204);
        });
    });

    app.put('/server', auth.serverKeyIsValid, function(req, res){
        var parsedServer = new Server(req.body);
        Server.findOne({'host': parsedServer.host, 'port': parsedServer.port}, function(err, queriedServer){
            if(err) {
                return console.error();   
            }
            if(queriedServer == null){
                parsedServer.save(function(err, parsedServer) {
                    if(err) {
                        console.log(err);
                        res.send(500);
                    }
                    else
                    {
                        res.send(201); 
                    }
                });
            }
            else {
                queriedServer.load = parsedServer.load;
                queriedServer.save(function(err, server) {
                    if(err) {
                        console.log(err);
                        res.send(500);
                    }
                    else
                    {
                        res.send(202); 
                    }
                });
            }
        })
    });

    app.get('/servers', function(req, res) {
        Server.find({}).sort({load: 'ascending'}).exec(function(err, servers) {
            res.send(servers);
        });
    });

    app.get('/server_down', function(req, res) {
        res.render('server_down.ejs');
    });

    app.get('/profile', auth.isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

