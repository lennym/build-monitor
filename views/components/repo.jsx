const React = require('react');
const request = require('r2');

class Repo extends React.Component {

  componentDidMount() {
    setInterval(() => this.load(), 60000);
    this.load();
  }

  load() {
    request(`/repo/${this.props.name}`).json
      .then(data => this.props.onLoad(data));
  }

  render() {
    const build = this.props.build || 'unknown';
    const classes = ['repo', `build-${build}`];
    const prs = this.props.pull_requests || [];
    return <div className={classes.join(' ')}>
      <h2><a href={this.props.url} target="_blank">{this.props.name}</a></h2>
      {
        prs.map(pr => {
          return <p className="pull-request">
            <img src={ pr.user.avatar_url } className="avatar" />
            <a href={ pr.html_url } target="_blank">{ pr.title }</a>
          </p>
        })
      }
    </div>
  }

}

module.exports = Repo;