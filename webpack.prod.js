import { builtinModules } from 'module';

const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglify-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
});