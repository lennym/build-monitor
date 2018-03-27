const octokit = require('@octokit/rest')();

module.exports = settings => {

  octokit.authenticate({
    type: 'oauth',
    token: settings.token
  });

  const owner = settings.team.split('/')[0];

  return (req, res, next) => {

    octokit.repos.getCombinedStatusForRef({ owner, repo: req.params.repo, ref: 'master'})
      .then(response => {
        if (!response.data) {
          return res.locals.build = 'unknown';
        }
        res.locals.build = response.data.state;
      })
      .then(() => {
        return octokit.pullRequests.getAll({ owner, repo: req.params.repo, state: 'open', sort: 'long-running' })
      })
      .then(response => {
        res.locals.pull_requests = response.data;
      })
      .then(() => {
        res.json({
          build: res.locals.build,
          pull_requests: res.locals.pull_requests
        });
      })
      .catch(next);

  }

}