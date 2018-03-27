const React = require('react');

const Monitor = require('./components/monitor');

class Index extends React.Component {

  render() {
    return <html>
      <head>
        <title>{this.props.title}</title>
        <link rel="stylesheet" href="/public/app.css" />
      </head>
      <body>
        <Monitor repos={this.props.repos}/>
        <script dangerouslySetInnerHTML={{__html: `window.REPOS=${JSON.stringify(this.props.repos)}`}} />
        <script src="/public/app.js"></script>
      </body>
    </html>
  }

}

module.exports = Index;
