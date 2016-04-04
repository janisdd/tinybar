/**
 * Created by janis dähne
 */

var path = require('path')

var ComponentPlugin = require("umd-require-webpack-plugin");

module.exports = {
  context: path.join(__dirname),
  entry: './main.js',
  output: {
    path: path.join(__dirname),
    filename: 'bundle.js',
    publicPath: '/'
  },
  devtool: 'source-map', // if we want a source map

  module: {

    unknownContextRegExp: /$^/,
    loaders: [
    ]
  },
  resolve: {
    extensions: ['', '.js']
  },
  plugins: [
    //new ComponentPlugin()
  ]
}