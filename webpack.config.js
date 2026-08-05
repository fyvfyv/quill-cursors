const path = require('path');

const environment = process.env.NODE_ENV || 'development';
const isProduction = environment === 'production';

const baseConfig = {
  resolve: {
    extensions: ['.ts', '.js'],
  },
  mode: environment,
  devtool: isProduction ? false : 'inline-source-map',
};

const umdOutput = {
  filename: '[name].js',
  path: path.resolve(__dirname, 'dist'),
  library: 'QuillCursors',
  libraryTarget: 'umd',
};

// The ESM bundles re-export the entry module's own exports, so they carry
// no library name.
const esmOutput = {
  filename: '[name].mjs',
  path: path.resolve(__dirname, 'dist'),
  library: {type: 'module'},
};

const tsRule = {
  test: /\.ts$/,
  exclude: /node_modules/,
  use: ['ts-loader'],
};

// The ESM builds emit ES2015 modules so webpack can expose the named exports
// statically, and skip the declaration files the UMD builds already emit.
const tsEsmRule = {
  test: /\.ts$/,
  exclude: /node_modules/,
  use: [{
    loader: 'ts-loader',
    options: {
      compilerOptions: {
        module: 'es2015',
        moduleResolution: 'node',
        declaration: false,
      },
    },
  }],
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
  output: {
    ...umdOutput,
    libraryExport: 'default',
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
  output: umdOutput,
  module: {
    rules: [tsRule],
  },
};

const moduleEsmBundle = {
  ...baseConfig,
  entry: {
    'quill-cursors': './src/index.ts',
  },
  output: esmOutput,
  experiments: {outputModule: true},
  module: {
    rules: [tsEsmRule, scssRule],
  },
};

const coreEsmBundle = {
  ...baseConfig,
  entry: {
    'quill-cursors.core': './src/index.core.ts',
  },
  output: esmOutput,
  experiments: {outputModule: true},
  module: {
    rules: [tsEsmRule],
  },
};

module.exports = [moduleBundle, coreBundleConfig, moduleEsmBundle, coreEsmBundle];
