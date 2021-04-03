const express = require('express');
const pass2 = require('passport-google-oauth20');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieSession = require('cookie-session');

require('./setup');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.set('view engine','ejs');

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieSession({
  name: 'intern-session',
  keys: ['key1', 'key2']
}))

const isLoggedIn = (req, res, next) => {
  if (req.user) {
      next();
  } else {
      res.sendStatus(401);
  }
}

app.get('/', (req,res)=>{
  res.render('home');
})

app.get('/success',(req,res)=>{
  res.render('show');
})
app.get('/login',(req,res)=>{
  res.send("Something went wrong");
})

app.get('/google',passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/success');
  });


  app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})
let port = process.env.PORT || 3000
app.listen(port,()=>{
  console.log("This is running");
})