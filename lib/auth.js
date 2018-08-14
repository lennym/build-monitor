const { Router } = require('express');
const passport = require('passport');
const { Strategy } = require('passport-github');

module.exports = settings => {

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use('github', new Strategy({
      clientID: settings.github.clientId,
      clientSecret: settings.github.secret,
      callbackURL: `${settings.url}/auth/github/callback`
    },
    function(accessToken, refreshToken, profile, cb) {
      cb(null, { ...profile, accessToken });
    }
  ));

  const router = Router();

  router.use(passport.initialize());
  router.use(passport.session());

  router.get('/auth/github/callback', passport.authenticate('github', { successRedirect: '/' }));
  router.get('/login', passport.authenticate('github'));

  router.use((req, res, next) => {
    if (!req.user) {
      return res.redirect('/login');
    }
    next();
  });

  return router;
}
