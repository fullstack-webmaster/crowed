const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, '../dist'),
    sourceMapFilename: '[name].[hash].js.map',
    publicPath: '',
    chunkFilename: '[id].chunk.js'
  },
  resolve: {
    modules: [
      path.join(__dirname, '../src'),
      'node_modules'
    ],
    extensions: ['.js', '.jsx', '.json', '.scss']
  },
  plugins: [
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'  // fetch API
    }),
    new webpack.DefinePlugin({
      __DEV__: process.env.NODE_ENV !== 'production',
      __TEST__: JSON.stringify(process.env.TEST || false),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __DATA_BASE_URL__: JSON.stringify(process.env.DATA_URL)
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      inject: true,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
        postcss: [
          autoprefixer
        ]
      }
    })
  ],
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   loader: 'eslint-loader',
      //   exclude: /node_modules/
      // },
      {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: /node_modules/,
      },
      // JavaScript / ES6
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      // Images
      // Inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: 'images/[name].[ext]?[hash]'
        }
      },
      // Fonts
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: 'fonts/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(geo)?json$/,
        loaders: ["json-loader"]
      },
      // CSS
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      }
    ]
  }
};
