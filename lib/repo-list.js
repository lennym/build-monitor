const octokit = require('@octokit/rest')();

module.exports = settings => {

  octokit.authenticate({
    type: 'oauth',
    token: settings.token
  });

  const org = settings.team.split('/')[0];
  const team = settings.team.split('/')[1];

  return (req, res, next) => {

    octokit.orgs.getTeams({ org, per_page: 100 })
      .then(response => {
        return response.data.find(t => t.slug === team);
      })
      .then(t => {
        return octokit.orgs.getTeamRepos({ id: t.id })
          .then(response => response.data);
      })
      .then(repos => {
        res.locals.repos = repos
      })
      .then(() => next())
      .catch(next);

  }

}