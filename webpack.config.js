import path from 'node:path';

const environment = process.env.NODE_ENV || 'development';
const isProduction = environment === 'production';

const baseConfig = {
  resolve: {
    extensions: ['.ts', '.js'],
    // Source uses node16-style `./x.js` specifiers that map onto .ts files.
    extensionAlias: {'.js': ['.ts', '.js']},
  },
  // The bundles re-export the entry module's own exports (default + Cursor),
  // so they carry no library name.
  output: {
    filename: '[name].js',
    path: path.resolve(import.meta.dirname, 'dist'),
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
  // Loads the stylesheet for its side effect; the last entry module's exports
  // become the bundle's exports.
  entry: {
    'quill-cursors': ['./assets/quill-cursors.scss', './src/index.ts'],
  },
  module: {
    rules: [tsRule, scssRule],
  },
  devServer: {
    static: [
      path.join(import.meta.dirname, 'example'),
      path.join(import.meta.dirname, 'node_modules/quill/dist'),
    ],
  },
};

const coreBundleConfig = {
  ...baseConfig,
  entry: {
    'quill-cursors.core': './src/index.ts',
  },
  module: {
    rules: [tsRule],
  },
};

export default [moduleBundle, coreBundleConfig];
