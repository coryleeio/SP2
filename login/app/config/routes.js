var auth = require('../app/auth');
var Server = require('../app/models/server');
var _ = require('underscore');
var googleConfig    = require('./googleConfig');

module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        Server.find({}).sort({load: 'ascending'}).exec(function(err, servers) {
            if(servers.length <= 0) {
                return res.render('server_down.ejs');
            }
            res.render('index.ejs', {
                googleClientId : googleConfig.clientID
            });
        });
    });

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google'), auth.setServerTargetCookies);
    app.get('/login', auth.setServerTargetCookies);
    app.put('/server', auth.serverKeyIsValid, function(req, res){
        console.log("Server key was valid.")
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
                    else {
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
                    else {
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

