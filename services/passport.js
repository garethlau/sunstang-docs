const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const SlackStrategy = require('passport-slack-oauth2').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');


// turns a user into an id
passport.serializeUser((user, done) => {
    done(null, user.id);
    console.log("user serialized");
});

//turns an id to a user
passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

// google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
        User.findOne({ googleId: profile.id }).then((existingUser) => {
            if (existingUser) {
                //user already exists
                done(null, existingUser);
            }
            else {  //create new user
                new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    admin: false
                }).save().then(user => done(null, user));
            }
        });
            console.log('accessToken', accessToken);
            console.log('refresh token', refreshToken);
            console.log('profile', profile);
        }
));

// slack strategy
passport.use(new SlackStrategy({
    clientID: keys.slackClientID,
    clientSecret: keys.slackClientSecret,
    skipUserProfile: false,
  },
  (accessToken, refreshToken, profile, done) => {
    //passport callback function
      User.findOne({ slackId : profile.id}).then((existingUser) => {
          if (existingUser) {
              //user already exists
              done(null, existingUser);
          }
          else {
              new User({
                  slackId : profile.id,
                  name: profile.user.name,
                  admin: false
              }).save().then(user => done(null, user));
          }
      });
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        console.log('profile', profile);
    }
));
