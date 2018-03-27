const React = require('react');

const Repo = require('./repo');

class Monitor extends React.Component {

  componentDidMount() {
    this.props.repos.map(repo => {
      this.setState({
        [repo.name]: {
          build: 'unknown',
          pull_requests: []
        }
      });
    });
  }

  repoLoaded(name, data) {
    this.setState({
      [name]: data
    });
  }

  render() {
    const repos = this.props.repos || [];
    return <React.Fragment>
      {
        repos.map(repo => {
          const state = this.state && this.state[repo.name] ? this.state[repo.name] : {}
          return <Repo
            name={repo.name}
            url={repo.html_url}
            build={state.build}
            pull_requests={state.pull_requests}
            key={repo.id}
            onLoad={data => this.repoLoaded(repo.name, data)}
            />
        })
      }
    </React.Fragment>
  }

}

module.exports = Monitor;