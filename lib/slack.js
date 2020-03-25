const { Router } = require('express');
const { Octokit } = require('@octokit/rest');
const { flatten, sortBy } = require('lodash');
const moment = require('moment');
const repos = require('./repo-list');

module.exports = (settings) => {
  const router = Router();

  const owner = settings.github.team.split('/')[0];

  const octokit = Octokit({
    auth: settings.github.token
  });

  router.use(repos(settings.github));

  router.use((req, res, next) => {
    const getPulls = res.locals.repos.map(repo => {
      return octokit.pulls.list({ owner, repo: repo.name, state: 'open', sort: 'long-running' })
        .then(response => response.data.map(pr => {
          return { ...pr, repo: repo.name };
        }));
    });
    Promise.all(getPulls)
      .then(prs => flatten(prs))
      .then(prs => prs.filter(pr => !pr.title.includes('WIP')))
      .then(prs => sortBy(prs, 'created_at'))
      .then(prs => {
        res.locals.prs = prs;
      })
      .then(() => next());
  });

  router.post('/', (req, res) => {
    const prs = res.locals.prs;
    const blocks = prs.map(pr => {
      return {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${pr.repo} - ${pr.title} (${moment(pr.created_at).toNow(true)})`
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'View'
          },
          url: pr.html_url
        }
      }
    })
    res.json({
      response_type: 'in_channel',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Found *${prs.length}* open Pull Request${prs.length === 1 ? '' : 's'}`
          }
        }
      ].concat(blocks)
    });
  });

  router.use((err, req, res, next) => {
    res.json({
      text: `An error occured while loading pull requests: ${err.message}`
    });
  });

  return router;
};