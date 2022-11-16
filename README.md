# build-monitor

## What it does

Shows you all the repos your team owns in green/red according to their build status.

Under each repo shows any open pull requests.

## Requirements:

* Node@18 or higher
* A github OAuth app for user to authenticate with
* A github token to do the initial repo fetch (to avoid having to grant the OAuth app permissions to an org)

## To use:

Click this button to deploy an instance to Heroku

[![](./assets/deploy-button.svg)](https://heroku.com/deploy?template=https://github.com/lennym/build-monitor/tree/master)

Set the following config variables in your Heroku app configuration:

* `GITHUB_CLIENT` - the id of a github OAuth app for users to authenticate with
* `GITHUB_SECRET` - a secret for the github OAuth app
* `GITHUB_TEAM` - the github team you want a build monitor for - as `<org>/<team name>`
* `GITHUB_TOKEN` - a github access token that has access to the repos
* `REDIRECT_URL` - the root url of the server
* `SESSION_TOKEN` - a random string used for session encryption
