module.exports = {
  port: process.env.PORT || 3000,
  title: process.env_BUILD_MONITOR_TITLE,
  session: 'asdfasdfasdfa',
  url: process.env.REDIRECT_URL || 'http://localhost:3000',
  github: {
    team: process.env.GITHUB_TEAM,
    clientId: process.env.GITHUB_CLIENT,
    secret: process.env.GITHUB_SECRET,
    token: process.env.GITHUB_TOKEN
  }
};
