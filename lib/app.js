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


  app.get('/repo/:repo', repo(settings));

  app.get('/', repos(settings), (req, res, next) => {
    res.render('index');
  });

  app.use((err, req, res, next) => {
    next(err);
  });

  return app;

};
