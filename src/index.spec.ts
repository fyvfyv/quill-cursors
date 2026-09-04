import * as fs from 'fs';
import * as path from 'path';

describe('index', () => {
  it('should export QuillCursors as default', () => {
    const indexCore = require('./index');
    const QuillCursors = require('./quill-cursors/quill-cursors').default;
    expect(indexCore.default).toBe(QuillCursors);
  });

  it('should export Cursor as a named export', () => {
    const indexCore = require('./index');
    const Cursor = require('./quill-cursors/cursor').default;
    expect(indexCore.Cursor).toBe(Cursor);
  });

  it('should NOT import any .scss or .css files', () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, 'index.ts'),
      'utf-8',
    );
    expect(source).not.toMatch(/\.scss/);
    expect(source).not.toMatch(/\.css/);
  });
});
