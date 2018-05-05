const path = require('path');
const webpack = require('webpack'); // to access built-in plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const autoprefixer = require('autoprefixer');

const NODE_ENV = process.env.NODE_ENV && process.env.NODE_ENV.trim()
const DEVELOPMENT = NODE_ENV === 'development';
const PRODUCTION = NODE_ENV === 'production';

module.exports = {
  entry: [
    'babel-polyfill',
    './src/application/index.js', 
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.scss'],
    alias: {
      'dist': path.resolve('dist')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader']
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader']
        }),
      },
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery', 
      'window.jQuery': 'jquery',
      'window.$': 'jquery',
      Popper: ['popper.js', 'default'],
    }),
    new LoaderOptionsPlugin({
      debug: !PRODUCTION,
      cache: !PRODUCTION,
      minimize: !PRODUCTION,
      options: {
          context: __dirname,
          postcss: [
              autoprefixer({
                  browsers: ['last 3 versions'],
              }),
          ],
          sassLoader: {
              outputStyle: PRODUCTION ? 'compressed' : 'expanded',
              precision: 10,
              sourceComments: false,
              sourceMap: PRODUCTION,
          },
          cssLoader: {
              minimize: true,
              sourceMap: true,
          },
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'libs',
      filename: '[name][hash].min.js',
    }),
    new ExtractTextPlugin({
      filename: 'dist/style.css',
      allChunks: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
    }),
  ],
};