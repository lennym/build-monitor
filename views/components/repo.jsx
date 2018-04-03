const React = require('react');
const request = require('r2');
const moment = require('moment');

class Repo extends React.Component {

  componentDidMount() {
    setInterval(() => this.load(), 60000);
    this.load();
  }

  load() {
    request(`/repo/${this.props.name}`).json
      .then(data => this.props.onLoad(data));
  }

  state(state) {
    switch (state) {
      case 'success':
        return '👌';
      case 'failure':
        return '💩';
    }
    return '🤷';
  }

  render() {
    const build = this.props.build || 'unknown';
    const classes = ['repo', `build-${build}`];
    const prs = (this.props.pull_requests || []).sort((a, b) => a.created_at < b.created_at ? -1 : 1);
    return <div className={classes.join(' ')}>
      <h2><a href={this.props.url} target="_blank">{this.props.name}</a></h2>
      {
        prs.map(pr => {
          return <p className="pull-request">
            <img src={ pr.user.avatar_url } className="avatar" />
            <a href={ pr.html_url } target="_blank">{ pr.title } ({ moment(pr.created_at).toNow(true) } ago)</a>
            <span className="state">{ this.state(pr.state) }</span>
          </p>
        })
      }
    </div>
  }

}

module.exports = Repo;