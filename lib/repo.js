const octokit = require('@octokit/rest')();
const Promise = require('bluebird');

module.exports = settings => {

  const owner = settings.team.split('/')[0];

  const request = (token, repo) => {
    octokit.authenticate({
      type: 'oauth',
      token
    });

    return octokit.repos.getCombinedStatusForRef({ owner, repo, ref: 'master' })
      .catch(e => {
        if (e.code === 404 && token !== settings.token) {
          return request(settings.token, repo);
        }
        console.log(e);
        return {};
      });
  }

  return (req, res, next) => {
    request(req.user.accessToken, req.params.repo)
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
            })
            .catch(() => pr);
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
      .catch(e => {
        res.json({
          build: res.locals.build || 'unknown',
          pull_requests: []
        });
      });

  }

}