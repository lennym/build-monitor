# build-monitor

## To use:

Click this button to deploy an instance to Heroku

[![](./assets/deploy-button.svg)](https://heroku.com/deploy?template=https://github.com/lennym/build-monitor/tree/master)

Set the following config variables in your Heroku app configuration:

* `GITHUB_TEAM` - the github team you want a build monitor for - as `<org>/<team name>`
* `GITHUB_TOKEN` - a github access token that has access to the repos

## What it does

Shows you all the repos your team owns in green/red according to their build status.

Under each repo shows any open pull requests.
