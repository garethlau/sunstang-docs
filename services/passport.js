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
passport.use(new SlackStrategy({
    clientID: keys.slackClientID,
    clientSecret: keys.slackClientSecret,
    skipUserProfile: false,
  },
  async (accessToken, refreshToken, profile, done) => {
    //passport callback function
      const existingUser = await User.findOne({ slackId : profile.id})
      if (existingUser) {
          //user already exists
          done(null, existingUser);
      }
      else {
          // create a new profile
          const user = new User({
              slackId : profile.id,
              name: profile.user.name,
              admin: false
          }).save()
          done(null, user);
      }
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        console.log('profile', profile);
    }
));
