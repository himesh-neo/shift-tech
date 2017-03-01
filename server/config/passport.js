// load up the user model
var UserAccount       = require('../models/account.js');
var User = require('../models/user.js');
var FacebookStrategy = require('passport-facebook').Strategy;

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

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

    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        passReqToCallback: true,
        profileFields: ['id', 'emails', 'name']

    },

    // facebook will send back the token and profile
    function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            UserAccount.findOne({ 'facebookId' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUserAccount = new UserAccount();

                    // set all of the facebook information in our user model
                    newUserAccount.facebookId   = profile.id; // set the users facebook id
                    newUserAccount.facebookbookAccessToken = token; // we will save the token that facebook provides to the user
                    newUserAccount.userid = req.user;
                    newUserAccount.type = 'facebook';
                    newUserAccount.expire = null;


                    // save our user to the database
                    newUserAccount.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUserAccount);
                    });
                }

            });
        });

    }));

};
