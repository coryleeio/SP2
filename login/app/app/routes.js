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
        successRedirect : '/profile', 
        failureRedirect : '/login', 
        failureFlash : true // allow flash messages
    }));

    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.put('/server', auth.serverKeyIsValid, function(req, res){
        var server = new Server(req.body);
        server.save(function(err, server) {
            if(err) {
                res.send(501);
            }
            else
            {
                res.send(201); 
            }
        });
    });

    app.get('/server', auth.isLoggedIn, function(req, res) {
        Server.find({}, function(err, servers) {
          res.send(servers);  
        });
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

