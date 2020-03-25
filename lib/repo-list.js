const { Octokit } = require('@octokit/rest');

const cache = {};

module.exports = settings => {

  const org = settings.team.split('/')[0];
  const team_slug = settings.team.split('/')[1];

  return (req, res, next) => {

    const octokit = new Octokit({
      auth: settings.token
    });

    if (Date.now() - cache.time < 180000) {
      res.locals.repos = cache.repos;
      return next();
    }

    octokit.teams.listReposInOrg({ org, team_slug, per_page: 100 })
      .then(response => response.data)
      .then(repos => {
        repos = repos.filter(r => !r.archived);
        cache.repos = repos;
        cache.time = Date.now();
        res.locals.repos = repos
      })
      .then(() => next())
      .catch(err => {
        console.error(err.stack);
        res.locals.repos = [];
        next();
      });

  }

}