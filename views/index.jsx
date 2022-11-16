const React = require('react');

const Monitor = require('./components/monitor');

class Index extends React.Component {

  render() {
    return <html>
      <head>
        <title>Build Monitor</title>
        <link rel="stylesheet" href="/public/app.css" />
        <link id="favicon" rel="shortcut icon" href="/public/favicon-good.ico" />
      </head>
      <body>
        <div id="app">
          <Monitor repos={this.props.repos}/>
        </div>
        <script dangerouslySetInnerHTML={{__html: `window.REPOS=${JSON.stringify(this.props.repos)}`}} />
        <script src="/public/app.js"></script>
      </body>
    </html>
  }

}

module.exports = Index;
