var auth = require('../config/auth.js');
var Server = require('./models/server.js');
var _ = require('underscore');
// app/routes.js
module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/server', 
        failureRedirect : '/login', 
        failureFlash : true // allow flash messages
    }));

    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/server',
        failureRedirect: '/signup',
        failureFlash: true
    }));

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

    app.get('/server', auth.isLoggedIn, function(req, res) {
        Server.find({}).sort({load: 'ascending'}).exec(function(err, servers) {
            if(servers.length == 0) {
               return res.redirect('/server_down');
            }
            var host = servers[0].host;
            var port = servers[0].port;
            var loginToken = auth.generateLoginToken(req.user.id, host, port);
            console.log("login token is: " + loginToken);
            res.cookie('loginToken', loginToken, { maxAge: 600000, httpOnly: true });
            res.redirect('http://' + host + ':' + port);  
        });
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
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

