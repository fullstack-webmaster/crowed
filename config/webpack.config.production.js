const merge = require('webpack-merge');
const webpack = require('webpack');
const config = require('./webpack.config.base');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(config, {
  devtool: 'source-map',
  entry: {
    bundle: ['./src/index'],
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-dom',
      'react-router-redux',
      'redux',
      'redux-thunk',
      'redux-promise',
      'redux-logger',
      'redux-immutable-state-invariant',
      'lodash',
      'd3',
      'classnames'
    ]
  },
  module: {
    rules: [{
      test: /\.scss$/,
      include: [
        path.resolve(__dirname, '../src'),
      ],
      use: ExtractTextPlugin.extract({
        use: 'css-loader!sass-loader',
        // use style-loader in development
        fallback: "style-loader"
      })
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: '[name].[hash].js',
      minChunks: Infinity
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new ExtractTextPlugin({
      filename: "[name].[contenthash].css",
      // disable: process.env.NODE_ENV === "development"
    }),
    new CopyWebpackPlugin([
      {from: 'src/data', to: 'data'}
    ]),
  ]
});
