const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/popup.js',
  output: {
    filename: 'popup.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'module',
    },
  },
  experiments: {
    outputModule: true,
  },
  mode: 'production',
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/popup.html", to: "popup.html" },
        { from: "src/popup.css", to: "popup.css" },
        { from: "src/manifest.json", to: "manifest.json" },
      ],
    }),
  ],
};
