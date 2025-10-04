import { describe, it, expect } from 'vitest';
import { sanitizeValue } from '@/middlewares/sanitize';

describe('sanitizeValue', () => {
  it('remove <script> tags', () => {
    const input = '<div>Hello</div><script>alert(1)</script>';
    const out = sanitizeValue(input);
    expect(out).toBe('<div>Hello</div>');
  });

  it('remove javascript: schema', () => {
    const input = 'javascript:alert(1)';
    const out = sanitizeValue(input);
    expect(out).toBe('alert(1)');
  });

  it('sanitize dangerous keys (they are omitted from result)', () => {
    const input = {
      safe: 'ok',
      __proto__: { hacked: true },
      constructor: 'evil',
      prototype: 'evil2'
    } as any;
    const out = sanitizeValue(input) as any;
    expect(out.safe).toBe('ok');
    // As propriedades perigosas não devem estar presentes como próprias
    expect(Object.prototype.hasOwnProperty.call(out, '__proto__')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(out, 'constructor')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(out, 'prototype')).toBe(false);
  });

  it('sanitize arrays recursively', () => {
    const input = ['a<script>x</script>', 'b'];
    const out = sanitizeValue(input) as any;
    expect(out).toEqual(['a', 'b']);
  });
});
