// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var GoogleStrategy  = require('passport-google-oauth').OAuth2Strategy;
// load up the user model
var User            = require('../models/user');
var Server          = require('../models/server');

var googleConfig    = require('./googleConfig');



// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
        clientID        : googleConfig.clientID,
        clientSecret    : googleConfig.clientSecret,
        callbackURL     : googleConfig.callbackURL
    },
    function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if(err){
                    return done(err);
                }

                if(user) {
                    // if found, log in.
                    return done(null, user);
                } else {
                    var newUser = new User();
                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.name = profile.displayName;
                    newUser.google.email = profile.emails[0].value;
                }

                // save the user
                newUser.save(function(err) {
                    if(err){
                        throw err;
                    }
                    return done(null, newUser);
                });
            });
        });
    }));
};