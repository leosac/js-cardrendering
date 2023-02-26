const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/lib/index.js',
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
};