const passport = require('passport');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./user');

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connection Open");
});


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

 //let mysite = process.env.SEV;
  
passport.use(new GoogleStrategy({
    clientID: "865219137619-q73sn6ohpuebftlakie3u15h34v3mssv.apps.googleusercontent.com",
    clientSecret: "-uocLHpouUeeP4TKTO0MCuB-",
    callbackURL: "http://localhost:3000/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({googleId: profile.id}).then(existingUser => {
      if (existingUser) {
          done(null, existingUser);
      } else {
          new User({googleId: profile.id}).save().then(user => done(null, user));
      }
  });
  }
));
