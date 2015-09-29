var auth = require('../app/auth');
var Server = require('../_common/serverside/models/server');
var _ = require('underscore');
var googleConfig    = require('../_common/serverside/config/googleConfig');

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
    app.get('/auth/google/callback', passport.authenticate('google'), function(req, res){
        res.sendStatus(204);
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
                        res.sendStatus(500);
                    }
                    else {
                        res.sendStatus(201); 
                    }
                });
            }
            else {
                queriedServer.load = parsedServer.load;
                queriedServer.save(function(err, server) {
                    if(err) {
                        console.log(err);
                        res.sendStatus(500);
                    }
                    else {
                        res.sendStatus(202); 
                    }
                });
            }
        })
    });

    app.get('/server', function(req, res) {
        Server.find({}).sort({load: 'ascending'}).exec(function(err, servers) {
            res.json(servers[0]);
        });
    });

    app.get('/servers', function(req, res) {
        Server.find({}).sort({load: 'ascending'}).exec(function(err, servers) {
            res.send(servers);
        });
    });

    // app.get('/profile', auth.isLoggedIn, function(req, res) {
    //     res.render('profile.ejs', {
    //         user : req.user
    //     });
    // });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

