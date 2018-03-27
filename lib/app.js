const express = require('express');
const path = require('path');

const views = require('express-react-views');

const repos = require('./repo-list');
const repo = require('./repo');

module.exports = settings => {

  const app = express();

  app.use('/public', express.static(path.resolve(__dirname, '../public')));

  app.set('view engine', 'jsx');
  app.set('views', path.resolve(__dirname, '../views'));
  app.engine('jsx', views.createEngine());

  app.use(repos(settings));

  app.use((req, res, next) => {
    res.locals.title = settings.title || `${settings.team} Build Monitor`;
  });

  app.get('/repo/:repo', repo(settings));

  app.get('/', (req, res, next) => {
    res.render('index');
  });

  return app;

};
