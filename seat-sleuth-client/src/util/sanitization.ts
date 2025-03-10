const SAFE_CHAR_REGEX = /[^a-zA-Z0-9-_]/g;

export function sanitizeEventName(name: string): string {
  return name
    .trim()
    .replace(/ /g, '-')
    .replace(/\//g, '_')
    .replace(SAFE_CHAR_REGEX, '');
}

export function unsanitizeEventName(name: string): string {
  return name
    .replace(/-/g, ' ')
    .replace(/_/g, '/'); 
}
