const path = require('path');

module.exports = {
  entry: './jscardrendering.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /src\/i18n\/.json/,
        loader: "@alienfast/i18next-loader",
      }
    ],
  }
};