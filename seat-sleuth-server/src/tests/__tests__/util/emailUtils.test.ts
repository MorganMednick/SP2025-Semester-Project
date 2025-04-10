import { sanitizeEventName, unsanitizeEventName } from '../../../util/emailUtils';

describe('sanitizeEventName', () => {
  it('replaces spaces with hyphens', () => {
    expect(sanitizeEventName('Taylor Swift Live')).toBe('Taylor-Swift-Live');
  });

  it('replaces slashes with underscores', () => {
    expect(sanitizeEventName('Drake / 21 Savage')).toBe('Drake-_-21-Savage');
  });

  it('removes unsafe characters', () => {
    expect(sanitizeEventName('AC/DC! @Live #Tour')).toBe('AC_DC-Live-Tour');
  });

  it('collapses multiple spaces into single hyphen', () => {
    expect(sanitizeEventName('  Foo    Bar  Baz  ')).toBe('Foo-Bar-Baz');
  });

  it('preserves allowed safe characters', () => {
    expect(sanitizeEventName("Rock'n'Roll & Chill - Night")).toBe("Rock'n'Roll-&-Chill---Night");
  });
});

describe('unsanitizeEventName', () => {
  it('replaces hyphens with spaces', () => {
    expect(unsanitizeEventName('Taylor-Swift-Live')).toBe('Taylor Swift Live');
  });

  it('replaces underscores with slashes', () => {
    expect(unsanitizeEventName('Drake-_21-Savage')).toBe('Drake /21 Savage');
  });

  it('works with a fully sanitized then unsanitized name', () => {
    const original = 'Beyoncé / Jay-Z - On The Run!';
    const sanitized = sanitizeEventName(original);
    const unsanitized = unsanitizeEventName(sanitized);

    expect(unsanitized).toContain('Jay Z');
  });
});
