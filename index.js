const App = require('./lib/app');
const config = require('./config');

App(config).listen(config.port);
