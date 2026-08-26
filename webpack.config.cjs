const path = require('path');

const environment = process.env.NODE_ENV || 'development';
const isProduction = environment === 'production';

const baseConfig = {
  resolve: {
    extensions: ['.ts', '.js'],
  },
  // The bundles re-export the entry module's own exports (default + Cursor),
  // so they carry no library name.
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: {type: 'module'},
  },
  experiments: {outputModule: true},
  mode: environment,
  devtool: isProduction ? false : 'inline-source-map',
};

const tsRule = {
  test: /\.ts$/,
  exclude: /node_modules/,
  use: ['ts-loader'],
};

const scssRule = {
  test: /\.scss$/,
  use: [
    'style-loader',
    'css-loader',
    'sass-loader',
  ],
};

const moduleBundle = {
  ...baseConfig,
  entry: {
    'quill-cursors': './src/index.ts',
  },
  module: {
    rules: [tsRule, scssRule],
  },
  devServer: {
    static: [
      path.join(__dirname, 'example'),
      path.join(__dirname, 'node_modules/quill/dist'),
    ],
  },
};

const coreBundleConfig = {
  ...baseConfig,
  entry: {
    'quill-cursors.core': './src/index.core.ts',
  },
  module: {
    rules: [tsRule],
  },
};

module.exports = [moduleBundle, coreBundleConfig];
