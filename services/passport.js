const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const SlackStrategy = require('passport-slack-oauth2').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');

const authConfig = require('./authConfig');

// turns a user into an id
passport.serializeUser((user, done) => {
    done(null, user.id);
    console.log("user serialized");
});

//turns an id to a user
/*
passport.deserializeUser((user, done) => {
    done(null, user);
});  
*/

// TODO
// look into why this didn't work
// then it did work ???
passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});


// google strategy, not being used
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
        const existingUser = await User.findOne({ googleId: profile.id })
        if (existingUser) {
            //user already exists
            done(null, existingUser);
        }
        else {  //create new user
            const user = await new User({
                googleId: profile.id,
                name: profile.displayName,
                admin: false
            }).save()
            done(null, user);
        }

        console.log('accessToken', accessToken);
        console.log('refresh token', refreshToken);
        console.log('profile', profile);
    }
));

// slack strategy
passport.use(
    new SlackStrategy({
        clientID: keys.slackClientID,
        clientSecret: keys.slackClientSecret,
        skipUserProfile: false,
        scope: ["identity.basic", "identity.email"],
    }, async (accessToken, refreshToken, profile, done) => {
        console.log("=== ACCESS TOKEN === > " + accessToken);
        console.log("=== REFRESH TOKEN === > " + refreshToken);
        console.log("=== PROFILE ===");
        console.log(profile);
        //passport callback function
        const existingUser = await User.findOne({ slackId : profile.id});
        if (existingUser) { //user already exists
            done(null, existingUser);
        }
        if (profile.team.id !== authConfig.slackTeamId) {
            // not apart of the workspace
            done(null, {});
        }
        else {  // create a new profile
            let isAdmin = false;
            console.log("=== CHECKING ADMIN === > " + profile.user.email + " : " + authConfig.adminEmails);
            // check if this is an admin email address
            if (authConfig.adminEmails.includes(profile.user.email)) { 
                isAdmin = true;
            }
            const user = new User({
                slackId : profile.id,
                name: profile.user.name,
                admin: isAdmin
            }).save();
            done(null, user);
        }

    }
));
