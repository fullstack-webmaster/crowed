const merge = require('webpack-merge');
const webpack = require('webpack');
const config = require('./webpack.config.base');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const GLOBALS = {
  'process.env': {
    'NODE_ENV': JSON.stringify('development')
  },
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'true'))
};

module.exports = merge(config, {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: [
      "react-hot-loader/patch",
      'webpack-hot-middleware/client',
      './src/index.js'
    ]
  },
  output: Object.assign({}, config.output, {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
    sourceMapFilename: '[name].js.map',
    publicPath: '/dist',
    chunkFilename: '[id].chunk.js'
  }),
  module: {
    rules: [{
      test: /\.scss$/,
      include: [
        path.resolve(__dirname, '../src'),
      ],
      loaders: [
        'style-loader',
        'css-loader',
        'postcss-loader',
        { loader: 'sass-loader', query: { outputStyle: 'expanded' } }
      ]
    }]
  },
  plugins: Object.assign([], config.plugins, [
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      { from: 'src/data', to: 'data' },
    ])
  ])
});
