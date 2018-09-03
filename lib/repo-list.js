const octokit = require('@octokit/rest')();

const cache = {};

module.exports = settings => {

  const org = settings.team.split('/')[0];
  const team = settings.team.split('/')[1];

  return (req, res, next) => {

    octokit.authenticate({
      type: 'oauth',
      token: settings.token
    });

    if (Date.now() - cache.time < 180000) {
      res.locals.repos = cache.repos;
      return next();
    }

    octokit.users.getTeams({ org, per_page: 100 })
      .then(response => {
        return response.data.find(t => t.slug === team);
      })
      .then(t => {
        return octokit.orgs.getTeamRepos({ id: t.id })
          .then(response => response.data);
      })
      .then(repos => {
        repos = repos.filter(r => !r.archived);
        cache.repos = repos;
        cache.time = Date.now();
        res.locals.repos = repos
      })
      .then(() => next())
      .catch(() => {
        res.locals.repos = [];
      });

  }

}