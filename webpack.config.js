const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const nodeConfig = {
  entry: './src/lib/index.js',
  target: 'node',
  output: {
    filename: 'cardrendering.node.js',
    library: 'cardrendering',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new ESLintPlugin()
  ],
  externals: {
    'canvas': 'canvas',
    'pixi.js': '@pixi/node'
  },
  optimization: {
    minimize: false
  }
};

const browserConfig = {
  entry: './src/lib/index.js',
  target: 'web',
  output: {
    filename: 'cardrendering.js',
    library: 'cardrendering',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new ESLintPlugin(),
    new HtmlWebpackPlugin({
      title: 'JS Card Rendering',
      template: 'example/index.html',
      scriptLoading: 'blocking',
      inject: false
    })
  ],
  externals: {
    '@pixi/node': '@pixi/node'
  }
};

module.exports = [nodeConfig, browserConfig];