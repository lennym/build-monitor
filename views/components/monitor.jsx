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

  sort(repos) {
    if (!this.state) {
      return repos;
    }
    return repos.sort((a, b) => {
      const stateA = this.state[a.name];
      const stateB = this.state[b.name];
      if (stateA.build === stateB.build) {
        return stateB.pull_requests.length - stateA.pull_requests.length;
      }
      if (this.state[a.name].build === 'failed') {
        return -1;
      }
      if (this.state[a.name].build === 'unknown') {
        return 1;
      }
    });
  }

  render() {
    const repos = this.props.repos || [];
    return <React.Fragment>
      {
        this.sort(repos).map(repo => {
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