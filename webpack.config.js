module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: require('path').resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  target: 'node',
};
