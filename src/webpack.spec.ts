import * as path from 'path';

describe('webpack config', () => {
  let configs: any[];

  beforeAll(() => {
    configs = require('../webpack.config');
  });

  function findConfigs(filename: string): any[] {
    return configs.filter((c: any) => c.output.filename === filename);
  }

  function findScssRule(config: any): any {
    return config.module.rules.find(
      (r: any) => r.test && r.test.toString().includes('scss'),
    );
  }

  it('should export an array of four configurations', () => {
    expect(Array.isArray(configs)).toBe(true);
    expect(configs).toHaveLength(4);
  });

  it('should keep the UMD bundles for both entries', () => {
    const umdConfigs = findConfigs('[name].js');
    expect(umdConfigs.map((c: any) => c.entry)).toEqual([
      {'quill-cursors': './src/index.ts'},
      {'quill-cursors.core': './src/index.core.ts'},
    ]);
    for (const config of umdConfigs) {
      expect(config.output.path).toBe(path.resolve(__dirname, '..', 'dist'));
      expect(config.output.libraryTarget).toBe('umd');
      expect(config.module.rules[0].use).toEqual(['ts-loader']);
    }
  });

  it('should produce ESM bundles for both entries', () => {
    const esmConfigs = findConfigs('[name].mjs');
    expect(esmConfigs.map((c: any) => c.entry)).toEqual([
      {'quill-cursors': './src/index.ts'},
      {'quill-cursors.core': './src/index.core.ts'},
    ]);
    for (const config of esmConfigs) {
      expect(config.output.path).toBe(path.resolve(__dirname, '..', 'dist'));
      expect(config.output.library).toEqual({type: 'module'});
      expect(config.experiments).toEqual({outputModule: true});
    }
  });

  it('should compile the ESM bundles to ES modules without declarations', () => {
    for (const config of findConfigs('[name].mjs')) {
      expect(config.module.rules[0].use[0].options.compilerOptions).toEqual({
        module: 'es2015',
        moduleResolution: 'node',
        declaration: false,
      });
    }
  });

  it('should not include SCSS rules in the core configs', () => {
    for (const config of configs) {
      if (config.entry['quill-cursors.core']) {
        expect(findScssRule(config)).toBeUndefined();
      } else {
        expect(findScssRule(config)).toBeDefined();
      }
    }
  });

  it('should disable devtool in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = 'production';
      jest.resetModules();
      const prodConfigs = require('../webpack.config');
      const coreConfig = prodConfigs.find(
        (c: any) => c.entry && c.entry['quill-cursors.core'],
      );
      expect(coreConfig.devtool).toBe(false);
    } finally {
      process.env.NODE_ENV = originalEnv;
      jest.resetModules();
    }
  });

  it('should default to development mode when NODE_ENV is unset', () => {
    const originalEnv = process.env.NODE_ENV;
    try {
      delete process.env.NODE_ENV;
      jest.resetModules();
      const devConfigs = require('../webpack.config');
      expect(devConfigs[0].mode).toBe('development');
    } finally {
      process.env.NODE_ENV = originalEnv;
      jest.resetModules();
    }
  });
});
