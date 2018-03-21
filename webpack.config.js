const path = require("path");

module.exports = {
  context: __dirname,
  entry: "./src/main.js",
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "bundle.js",
    devtoolModuleFilenameTemplate: '[resourcePath]',
    devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
  },
  devtool: 'source-maps',
};
