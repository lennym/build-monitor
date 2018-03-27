const React = require('react');
const ReactDOM = require('react-dom');
const Component = require('../../views/components/monitor');

ReactDOM.render(<Component repos={window.REPOS} />, document.body);
