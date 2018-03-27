const path = require('path');

module.exports = {
  entry: {
    app: './assets/js/app.jsx'
  },
  output: {
    path: path.resolve(__dirname, './public')
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
};
