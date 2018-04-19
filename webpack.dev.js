const path = require('path');
const {
  HotModuleReplacementPlugin,
  NamedModulesPlugin,
} = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge.strategy({
  entry: 'prepend',
})(common, {
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
  ],
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    contentBase: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new NamedModulesPlugin(),
  ],
});