const morgan = require('morgan');
const express = require('express');
const path = require('path');
const session = require('express-session');
const views = require('express-react-views');

const auth = require('./auth');
const repos = require('./repo-list');
const repo = require('./repo');
const slack = require('./slack');

module.exports = settings => {

  const app = express();

  app.use('/public', express.static(path.resolve(__dirname, '../public')));

  app.set('view engine', 'jsx');
  app.set('views', path.resolve(__dirname, '../views'));
  app.engine('jsx', views.createEngine());

  app.use(session({
    secret: settings.session,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

  app.use(morgan('dev'));

  app.use('/slack', slack(settings));

  app.use('/', auth(settings));

  app.get('/repo/:repo', repo(settings.github));

  app.get('/', repos(settings.github), (req, res, next) => {
    res.render('index');
  });

  app.use((err, req, res, next) => {
    next(err);
  });

  return app;

};
