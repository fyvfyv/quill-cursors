import * as path from 'path';

describe('webpack config', () => {
  let configs: any[];

  beforeAll(() => {
    configs = require('../webpack.config.cjs');
  });

  function findScssRule(config: any): any {
    return config.module.rules.find(
      (r: any) => r.test && r.test.toString().includes('scss'),
    );
  }

  it('should export an array of two configurations', () => {
    expect(Array.isArray(configs)).toBe(true);
    expect(configs).toHaveLength(2);
  });

  it('should produce an ES module bundle for both entries', () => {
    expect(configs.map((c: any) => c.entry)).toEqual([
      {'quill-cursors': ['./assets/quill-cursors.scss', './src/index.ts']},
      {'quill-cursors.core': './src/index.ts'},
    ]);
    for (const config of configs) {
      expect(config.output.filename).toBe('[name].js');
      expect(config.output.path).toBe(path.resolve(__dirname, '..', 'dist'));
      expect(config.output.library).toEqual({type: 'module'});
      expect(config.experiments).toEqual({outputModule: true});
      expect(config.module.rules[0].use).toEqual(['ts-loader']);
      expect(config.resolve.extensionAlias).toEqual({'.js': ['.ts', '.js']});
    }
  });

  it('should not include SCSS rules in the core config', () => {
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
      const prodConfigs = require('../webpack.config.cjs');
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
      const devConfigs = require('../webpack.config.cjs');
      expect(devConfigs[0].mode).toBe('development');
    } finally {
      process.env.NODE_ENV = originalEnv;
      jest.resetModules();
    }
  });
});
