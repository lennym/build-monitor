const octokit = require('@octokit/rest')();
const Promise = require('bluebird');

module.exports = settings => {

  octokit.authenticate({
    type: 'oauth',
    token: settings.token
  });

  const owner = settings.team.split('/')[0];

  return (req, res, next) => {

    octokit.repos.getCombinedStatusForRef({ owner, repo: req.params.repo, ref: 'master' })
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
        return Promise.map(response.data, pr => {
          return octokit.repos.getCombinedStatusForRef({ owner, repo: req.params.repo, ref: pr.head.sha })
            .then((response) => {
              return Object.assign(pr, { state: response.data.state });
            });
        })
      })
      .then(prs => {
        return res.locals.pull_requests = prs;
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