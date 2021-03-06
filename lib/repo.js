const { Octokit } = require('@octokit/rest');
const { get } = require('lodash');
const Promise = require('bluebird');

module.exports = settings => {

  const owner = settings.team.split('/')[0];

  const retryable = (fn, token) => {

    const octokit = new Octokit({
      auth: token
    })

    return fn(octokit)
      .catch(e => {
        if (e.status === 404 && token !== settings.token) {
          return retryable(fn, settings.token);
        }
        return {};
      });

  }

  return (req, res, next) => {

    const octokit = new Octokit({
      auth: req.user.accessToken
    });

    const repo = req.params.repo;
    const token = req.user.accessToken;

    return Promise.resolve()
      .then(() => {
        return retryable(octokit => octokit.repos.get({ owner, repo }), token);
      })
      .then(result => {
        const ref = get(result, 'data.default_branch') || 'master';
        return retryable(octokit => octokit.repos.getCombinedStatusForRef({ owner, repo, ref }), token);
      })
      .then(response => {
        if (!response.data) {
          return res.locals.build = 'unknown';
        }
        if (!response.data.statuses.length) {
          return res.locals.build = 'unknown';
        }
        if ((response.data.statuses[0].target_url).includes('https://drone.acp.homeoffice.gov.uk/')) {
          res.locals.legacyDrone = true;
        }
        res.locals.build = response.data.state;
      })
      .then(() => {
        return retryable(octokit => octokit.pulls.list({ owner, repo, state: 'open', sort: 'long-running' }), token);
      })
      .then(response => {
        return Promise.map(response.data, pr => {
          return retryable(octokit => octokit.repos.getCombinedStatusForRef({ owner, repo, ref: pr.head.sha }), token)
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
        res.json(res.locals);
      })
      .catch(e => {
        console.error(e);
        res.json({
          build: res.locals.build || 'unknown',
          pull_requests: []
        });
      });

  }

}