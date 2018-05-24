const path = require('path');

module.exports = {
  context: __dirname,
  entry: './js/disk_sampling_demo.js',
  output: {
    path: path.join(__dirname, 'js'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devtool: 'source-maps',
  module: {
    loaders: [
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: ['env', 'react']
      }
    },
    {
      test: /\.node$/,
      loader: 'node-loader'
    }
    ]
  }
};
