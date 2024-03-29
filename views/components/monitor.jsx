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
        if (stateB.pull_requests.length === stateA.pull_requests.length) {
          return a.name < b.name ? -1 : 1;
        }
        return stateB.pull_requests.length - stateA.pull_requests.length;
      }
      const statuses = ['failure', 'pending', 'success', 'unknown'];
      const indexA = statuses.indexOf(stateA.build);
      const indexB = statuses.indexOf(stateB.build);
      return indexA - indexB;
    });
  }

  countPRs() {
    if (!this.state) {
      return 0;
    }
    return this.props.repos.reduce((count, repo) => {
      return count + this.state[repo.name].pull_requests.filter(pr => !pr.title.includes('WIP')).length;
    }, 0);
  }

  updatePageTitle() {
    if (!this.state) {
      return;
    }
    const prs = this.countPRs();
    document.title = `(${prs}) Build Monitor`;
  }

  updateFavicon() {
    if (!this.state) {
      return;
    }
    const passed = this.props.repos.reduce((p, repo) => p && this.state[repo.name].build !== 'failure', true);
    document.getElementById('favicon').setAttribute('href', passed ? '/public/favicon-good.ico' : '/public/favicon-bad.ico');
  }

  render() {
    const repos = this.props.repos || [];
    this.updatePageTitle();
    this.updateFavicon();

    const prs = this.countPRs();
    return <React.Fragment>
      <div className="headline"><span>{ prs }</span> open PR{ prs === 1 ? ''  : 's'}</div>
      <div className="repo-list">
      {
        this.sort(repos).map(repo => {
          const state = this.state && this.state[repo.name] ? this.state[repo.name] : {}
          return <Repo
            key={repo.name}
            name={repo.name}
            label={`${repo.name}${state.legacyDrone ? '*' : ''}`}
            url={repo.html_url}
            build={state.build}
            pull_requests={state.pull_requests}
            key={repo.id}
            onLoad={data => this.repoLoaded(repo.name, data)}
            />
        })
      }
      </div>
    </React.Fragment>
  }

}

module.exports = Monitor;
