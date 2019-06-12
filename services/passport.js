const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const SlackStrategy = require('passport-slack-oauth2').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');

const adminEmails = require('./adminEmails');

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

/*
NOTE FOR SLACK AUTH
Have to go to 'https://api.slack.com/apps' to change the redirect url between prod and dev
IF PROD, use: https://sunstang-website.herokuapp.com/auth/slack/callback
if DEV, use: http://localhost:3000/auth/slack/callback
*/

passport.use(
    new SlackStrategy({
        clientID: keys.slackClientID,
        clientSecret: keys.slackClientSecret,
        skipUserProfile: false,
        scope: ["identity.basic", "identity.email"],
    }, async (accessToken, refreshToken, profile, done) => {
        //passport callback function
        const existingUser = await User.findOne({ slackId : profile.id});
        if (existingUser) { //user already exists
            done(null, existingUser);
        }
        else {  // create a new profile
            let isAdmin = false;
            console.log("Admin emails are", adminEmails);
            // check if this is an admin email address
            if (adminEmails.includes(profile.user.email)) { 
                isAdmin = true;
            }
            const user = new User({
                slackId : profile.id,
                name: profile.user.name,
                admin: isAdmin
            }).save();
            done(null, user);
        }
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        console.log('profile', profile);
    }
));
